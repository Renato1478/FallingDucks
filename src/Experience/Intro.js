import * as THREE from "three";
import { gsap } from "gsap";

import Experience from "./Experience.js";

export default class Intro {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    /**
     * Overlay
     */
    this.setOverlay();

    /**
     * Loading bar
     */
    this.setLoadingBar();
  }

  setOverlay = () => {
    this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.overlayMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 0.0);
        }
    `,
      fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.53, 0.8, 0.92, uAlpha);
        }
    `,
    });
    this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
    this.scene.add(this.overlay);
  };

  setLoadingBar = () => {
    this.loadingBarElement = document.createElement("div");
    this.loadingBarElement.classList.add("loading-bar");
    document.body.appendChild(this.loadingBarElement);
  };

  onProgress = (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    this.loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  };

  onReady = () => {
    gsap.delayedCall(0.5, () => {
      this.loadingBarElement.classList.add("ended"); // 1.5s duration
      this.loadingBarElement.style.transform = ``;
      gsap.delayedCall(1.5, () => {
        gsap.to(
          this.overlayMaterial.uniforms.uAlpha,
          3, // duration (seconds)
          {
            value: 0,
          }
        );
      });
    });
  };
}
