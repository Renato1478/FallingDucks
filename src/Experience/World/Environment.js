import * as THREE from "three";
import Experience from "../Experience.js";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    // Resource
    this.resource = this.resources.items.waterfallEnvironmentModel;

    this.setModel();
    this.setAmbientLight();
    this.setSunLight();
    this.setEnvironmentMap();
    this.setFog();
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model); // "Little Farm House" (https://skfb.ly/oAr9O) by HugoMFerreira is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!["Waterfall", "Water001", "Water002"].includes(child.name)) {
          child.castShadow = true;
        }
        child.receiveShadow = true;
      }
    });
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 3);
    this.scene.add(this.ambientLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.ambientLight, "intensity")
        .name("ambientLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);
    }
  }

  setSunLight() {
    this.sunLight = new THREE.SpotLight("#ffffff", 1000, 0, undefined, 0.5);
    this.sunLight.position.set(0, 15, 0);
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.shadow.camera.far = 50;
    this.sunLight.castShadow = true;
    // this.scene.add(new THREE.SpotLightHelper(this.sunLight));
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("setSunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials);
    }
  }

  setFog() {
    this.scene.fog = new THREE.Fog("#87CEEB", 20, 45);
    this.scene.fog;
  }
}
