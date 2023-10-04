import * as THREE from "three";
import Experience from "../Experience.js";
import * as CANNON from "cannon-es";

export default class Water {
  constructor(id, position, scale) {
    this.experience = new Experience();
    this.id = id;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.world = this.experience.world;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder(this.id);
    }

    // Setup Water Collision
    this.setWaterCollision(position, scale);
  }

  setWaterCollision(position, scale) {
    this.parameters = {
      scale: scale,
      position: position,
    };

    /**
     * Cannon.js Body
     */
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        this.parameters.scale.x * 0.5,
        this.parameters.scale.y * 0.5,
        this.parameters.scale.z * 0.5
      )
    );
    const body = new CANNON.Body();
    body.mass = 0;
    body.addShape(shape);
    body.material = this.world.physicsWorld.defaultMaterial;
    // Position
    body.position.set(
      this.parameters.position.x,
      this.parameters.position.y,
      this.parameters.position.z
    );
    // Rotation
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);

    this.world.physicsWorld.addBody(body);

    this.physicsObject = {
      shape: shape,
      body: body,
    };

    /**
     * Debug
     */
    if (this.debug.active) {
      this.parameters.showDebugMesh = false;

      const onChangePosition = () => {
        if (this.parameters.showDebugMesh) {
          this.physicsObject.body.position.set(
            this.parameters.position.x,
            this.parameters.position.y,
            this.parameters.position.z
          );
        }
      };

      // Sizes & Dimensions
      this.debugFolder
        .add(this.parameters.position, "x")
        .min(-100)
        .max(100)
        .step(0.01)
        .name("X Position")
        .onChange(onChangePosition);
      this.debugFolder
        .add(this.parameters.position, "y")
        .min(-100)
        .max(100)
        .step(0.01)
        .name("Y Position")
        .onChange(onChangePosition);
      this.debugFolder
        .add(this.parameters.position, "z")
        .min(-100)
        .max(100)
        .step(0.01)
        .name("Z Position")
        .onChange(onChangePosition);

      // Water Collision Area
      const toggleDebugMesh = () => {
        if (this.parameters.showDebugMesh) {
          // Three js box (for debugging purposes)
          const debugMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
              this.parameters.scale.x,
              this.parameters.scale.y,
              this.parameters.scale.z
            ),
            new THREE.MeshStandardMaterial({
              wireframe: true,
            })
          );
          debugMesh.position.copy(body.position);
          debugMesh.quaternion.copy(body.quaternion);
          debugMesh.receiveShadow = true;
          debugMesh.rotation.x = -Math.PI * 0.5;
          this.scene.add(debugMesh);
          this.physicsObject.debugMesh = debugMesh;
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
}
