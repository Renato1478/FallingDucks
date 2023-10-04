import * as THREE from "three";
import Experience from "../Experience.js";
import { createPhysicsBox } from "../Utils/CannonUtils.js";

export default class Duck {
  constructor(position, model = null) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.world = this.experience.world;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("duck");
    }

    // Resource
    this.resource = this.resources.items.duckModel;

    this.setModel(position, model);
    // this.setAnimation()
  }

  setModel(position, model = null) {
    this.parameters = {
      scale: {
        x: 0.65,
        y: 0.65,
        z: 0.65,
      },
      position: position,
    };

    /**
     * Cannon.js body
     */
    const [width, height, depth] = [1, 0.1, 0.9];
    const { shape, body } = createPhysicsBox(
      width,
      height,
      depth,
      this.parameters.position,
      this.world.physicsWorld.defaultMaterial
    );
    body.allowSleep = false;
    this.world.physicsWorld.addBody(body);

    /**
     * Three.js model
     */
    this.model = model ?? this.resource.scene;
    this.model.scale.set(
      this.parameters.scale.x,
      this.parameters.scale.y,
      this.parameters.scale.z
    );
    this.model.position.set(this.parameters.position);
    const axis = new THREE.Vector3(0, 0, 1);
    const rad = 0.2;
    this.model.rotateOnAxis(axis, rad);
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = false;
        child.castShadow = true;
      }
    });

    // Save in objects to update
    this.world.objectsToUpdate.push({
      mesh: this.model,
      body: body,
    });
    // Adding to class physics object
    this.physicsObject = {
      shape,
      body,
    };

    /**
     * Debug
     */
    if (this.debug.active) {
      // Three.js mesh (for debugging purposes)
      this.parameters.showDebugMesh = false;
      const toggleDebugMesh = () => {
        if (this.parameters.showDebugMesh) {
          const boxGeometry = new THREE.BoxGeometry(width, height, depth);
          const boxMaterial = new THREE.MeshStandardMaterial({
            wireframe: true,
          });
          const debugMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          debugMesh.scale.set(width, height, depth);
          debugMesh.castShadow = true;
          debugMesh.position.copy(this.parameters.position);
          this.scene.add(debugMesh);
          this.physicsObject.debugMesh = debugMesh;
          this.world.objectsToUpdate.push({
            mesh: debugMesh,
            body: body,
          });
        } else {
          this.scene.remove(this.physicsObject.debugMesh);
        }
      };

      this.debugFolder
        .add(this.parameters, "showDebugMesh")
        .listen()
        .onChange(toggleDebugMesh)
        .name("showColliderWireframe");
    }
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
  }

  destroy() {
    // Debug
    if (this.debug.active) {
      this.debugFolder.destroy();
    }

    // Traverse the whole scene
    this.model.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
  }
}
