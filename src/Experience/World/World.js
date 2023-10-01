import * as THREE from "three";
import * as CANNON from "cannon-es";

import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Duck from "./Duck.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.duck = new Duck();
      this.environment = new Environment();
    });

    /**
     * Physics
     */
    // World
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.allowSleep = true;
    this.physicsWorld.gravity.set(0, -0.982, 0);

    // Objects to update
    this.objectsToUpdate = [];

    // Materials
    const defaultMaterial = new CANNON.Material("default");

    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    this.physicsWorld.addContactMaterial(defaultContactMaterial);
    this.physicsWorld.defaultContactMaterial = defaultContactMaterial;

    /**
     * Utils
     */
    this.clock = new THREE.Clock();
    this.oldElapsedTime = 0;
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;

    // Update physics world
    if (this.experience.gameStatus === "resumed") {
      this.physicsWorld.step(1 / 60, deltaTime, 3);

      for (const object of this.objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
      }

      if (this.duck) {
        this.duck.update();
      }
    }
  }
}
