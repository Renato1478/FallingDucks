import * as THREE from "three";
import Experience from "../Experience.js";
import * as CANNON from "cannon-es";

export default class Duck {
  constructor() {
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

    this.setModel();
    // this.setAnimation()
  }

  setModel() {
    this.model = this.resource.scene;

    this.model.scale.set(0.65, 0.65, 0.65);
    this.model.position.set(-2, 0, -4);

    const axis = new THREE.Vector3(0, 0, 1);
    const rad = 0.2;
    this.model.rotateOnAxis(axis, rad);

    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });

    // Cannon.js body
    const [width, height, depth] = [1, 1, 1];
    const shape = new CANNON.Box(
      new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    );
    const body = new CANNON.Body({
      mass: width * height * depth,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: this.world.physicsWorld.defaultMaterial,
    });
    body.position.copy(this.model.position);
    // body.addEventListener("collide", playHitSound);
    this.world.physicsWorld.addBody(body);

    // Save in objects to update
    this.world.objectsToUpdate.push({
      mesh: this.model,
      body: body,
    });
  }

  // setAnimation() {
  //   this.animation = {};

  //   // Mixer
  //   this.animation.mixer = new THREE.AnimationMixer(this.model);

  //   // Actions
  //   this.animation.actions = {};

  //   this.animation.actions.idle = this.animation.mixer.clipAction(
  //     this.resource.animations[0]
  //   );
  //   this.animation.actions.walking = this.animation.mixer.clipAction(
  //     this.resource.animations[1]
  //   );
  //   this.animation.actions.running = this.animation.mixer.clipAction(
  //     this.resource.animations[2]
  //   );

  //   this.animation.actions.current = this.animation.actions.idle;
  //   this.animation.actions.current.play();

  //   // Play the action
  //   this.animation.play = (name) => {
  //     const newAction = this.animation.actions[name];
  //     const oldAction = this.animation.actions.current;

  //     newAction.reset();
  //     newAction.play();
  //     newAction.crossFadeFrom(oldAction, 1);

  //     this.animation.actions.current = newAction;
  //   };

  //   // Debug
  //   if (this.debug.active) {
  //     const debugObject = {
  //       playIdle: () => {
  //         this.animation.play("idle");
  //       },
  //       playWalking: () => {
  //         this.animation.play("walking");
  //       },
  //       playRunning: () => {
  //         this.animation.play("running");
  //       },
  //     };
  //     this.debugFolder.add(debugObject, "playIdle");
  //     this.debugFolder.add(debugObject, "playWalking");
  //     this.debugFolder.add(debugObject, "playRunning");
  //   }
  // }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
  }
}
