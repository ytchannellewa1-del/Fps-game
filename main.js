// main.js
import { weapons } from "./weapons.js";
import { loadMap } from "./maps.js";

// --- THREE.js scene setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Player setup
camera.position.set(0, 2, 5);
let velocityY = 0;
let canJump = true;
let health = 100;
let currentWeapon = "shotgun";

// Load initial map
loadMap(scene, "vineyard");

// --- Input handling ---
const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

document.addEventListener("click", () => {
  document.body.requestPointerLock();
  shoot();
});

// --- Mouse look ---
let yaw = 0,
  pitch = 0;
document.addEventListener("mousemove", (e) => {
  if (!document.pointerLockElement) return;
  yaw -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch = Math.max(-1.5, Math.min(1.5, pitch));
  camera.rotation.set(pitch, yaw, 0);
});

// --- Movement and gravity ---
function updateMovement() {
  const speed = 0.15;
  const dir = new THREE.Vector3();

  if (keys["w"]) dir.z -= 1;
  if (keys["s"]) dir.z += 1;
  if (keys["a"]) dir.x -= 1;
  if (keys["d"]) dir.x += 1;

  dir.applyEuler(camera.rotation);
  camera.position.addScaledVector(dir, speed);

  // Gravity
  velocityY -= 0.01;
  camera.position.y += velocityY;

  if (camera.position.y < 2) {
    camera.position.y = 2;
    velocityY = 0;
    canJump = true;
  }

  // Jump
  if (keys[" "] && canJump) {
    velocityY = 0.25;
    canJump = false;
  }
}

// --- Shooting ---
function shoot() {
  const ray = new THREE.Raycaster();
  ray.setFromCamera(new THREE.Vector2(0, 0), camera);

  if (currentWeapon === "shotgun") {
    for (let i = 0; i < weapons.shotgun.pellets; i++) {
      ray.ray.direction.x += (Math.random() - 0.5) * weapons.shotgun.spread;
      ray.ray.direction.y += (Math.random() - 0.5) * weapons.shotgun.spread;
    }

    // Shotgun jump boost if shooting ground close
    const groundHit = ray.intersectObjects(scene.children)[0];
    if (groundHit && groundHit.distance < 5 && camera.position.y <= 2.2) {
      velocityY += weapons.shotgun.knockback;
    }
  }

  // Example placeholder for damage (enemies not added yet)
  // TODO: Ray intersects enemies, calculate distance & apply damage
}

// --- Distance-based damage calculation ---
function getDamage(weapon, distance, headshot = false) {
  const w = weapons[weapon];
  if (distance > w.maxRange) return 0;

  if (weapon === "sniper") return headshot ? w.headshot : w.body;

  if (weapon === "shotgun") {
    if (distance <= w.optimalRange) return w.maxDamage;
    const falloff =
      1 - (distance - w.optimalRange) / (w.maxRange - w.optimalRange);
    return Math.max(w.minDamage, w.maxDamage * falloff);
  }

  // SMG / AR
  if (distance <= w.optimalRange) return w.damage;
  const falloff =
    1 - (distance - w.optimalRange) / (w.maxRange - w.optimalRange);
  return Math.max(5, w.damage * falloff);
}

// --- Respawn ---
function respawn() {
  health = 100;
  camera.position.set(0, 2, 5);
}

// --- Main loop ---
function animate() {
  updateMovement();
  document.getElementById("hp").innerText = health;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
