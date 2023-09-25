import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import EventEmitter from "./EventEmitter.js";
import Experience from "../Experience.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.sources = sources;
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        this.trigger("ready");
        this.experience.intro.onReady();
      },
      // Progress
      this.experience.intro.onProgress
    );

    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
    this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(
      this.loadingManager
    );
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;
  }
}
