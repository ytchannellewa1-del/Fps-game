// maps.js

export function loadMap(scene, type) {
  // Clear previous map
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  // Add basic light
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  light.position.set(0, 50, 0);
  scene.add(light);

  // Select map type
  if (type === "vineyard") {
    createGround(scene, 0x556b2f); // greenish ground
    createBuilding(scene, -20, -20, 2); // building with 2 floors
    createBuilding(scene, 15, 10, 1);
    createBuilding(scene, 0, 30, 3);
  } else if (type === "factory") {
    createGround(scene, 0x333333); // gray factory floor
    createBuilding(scene, -25, -25, 1);
    createBuilding(scene, 20, 0, 2);
    createBuilding(scene, 0, 20, 2);
  }
}

// --- Helper: Create ground ---
function createGround(scene, color) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.name = "ground";
  scene.add(ground);
}

// --- Helper: Create a building with floors ---
function createBuilding(scene, x, z, floors = 1) {
  for (let i = 0; i < floors; i++) {
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 1, 20),
      new THREE.MeshStandardMaterial({ color: 0x777777 })
    );
    floor.position.set(x, i * 5 + 2, z);
    floor.name = "building";
    scene.add(floor);
  }
}
