import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.OrthographicCamera(
      this.sizes.width / -2,
      this.sizes.width / 2,
      this.sizes.height / 2,
      this.sizes.height / -2,
      1,
      100
    );
    // camera position
    this.instance.position.set(
      18.824752835704036,
      6.187407931691524,
      12.176794810938253
    );
    // camera quaterions
    this.instance.setRotationFromQuaternion(
      new THREE.Quaternion(
        -0.1747399215527249,
        0.42113637184974045,
        0.08304644291451876,
        0.8861226802425441
      )
    );
    // zoom
    this.instance.zoom = 80;
    // far camera
    this.instance.far = 45;
    // need this update in order to work
    this.instance.updateProjectionMatrix();

    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    // Zoom
    this.controls.minZoom = 75;
    this.controls.maxZoom = 90;
    this.controls.zoomSpeed = 0.2;
    // Rotate
    // this.controls.maxAzimuthAngle = Math.PI;
    // this.controls.minAzimuthAngle = Math.PI;
    // this.controls.enablePan = false;

    // this.controls.mouseButtons = {
    //   LEFT: THREE.MOUSE.ROTATE,
    //   MIDDLE: THREE.MOUSE.DOLLY,
    //   RIGHT: THREE.MOUSE.ROTATE,
    // };
    this.controls.rotateSpeed = 0.05;
  }

  resize() {
    // this.instance.aspect = this.sizes.width / this.sizes.height; // ? If was perspective camera
    this.instance.left = this.sizes.width / -2;
    this.instance.right = this.sizes.width / 2;
    this.instance.top = this.sizes.height / 2;
    this.instance.bottom = this.sizes.height / -2;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();

    // console.log(this.instance.position);
    // console.log(this.instance.quaternion);
  }
}
