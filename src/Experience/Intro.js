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
     * Loading info
     */
    this.setLoadingInfo();
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

  removeOverlay = () => {
    gsap.delayedCall(0.5, () => {
      gsap.to(
        this.overlayMaterial.uniforms.uAlpha,
        3, // duration (seconds)
        {
          value: 0,
        }
      );
    });
  };

  setLoadingInfo = () => {
    // Criar a div de classe 'loading-container'
    this.loadingContainerElement = document.createElement("div");
    this.loadingContainerElement.classList.add("loading-container");
    document.body.appendChild(this.loadingContainerElement);

    // text
    this.loadingTextElement = document.createElement("h2");
    this.loadingTextElement.classList.add("loading-text");
    this.loadingTextElement.innerHTML = "0%";
    this.loadingContainerElement.appendChild(this.loadingTextElement);

    // bar
    this.loadingBarElement = document.createElement("div");
    this.loadingBarElement.classList.add("loading-bar");
    this.loadingContainerElement.appendChild(this.loadingBarElement);
  };

  removeLoadingInfo = () => {
    this.loadingContainerElement.classList.add("ended"); // 0.5s duration
    gsap.delayedCall(0.5, () => {
      this.loadingContainerElement.style.display = "none";
    });
  };

  setStartButtonElement = () => {
    // Criar a div de classe 'intro-container'
    this.introContainerElement = document.createElement("div");
    this.introContainerElement.classList.add("loading-container");
    document.body.appendChild(this.introContainerElement);

    this.startButtonElement = document.createElement("button");
    this.startButtonElement.classList.add("start-button");
    this.startButtonElement.innerHTML = "QUACK!";
    this.startButtonElement.onclick = () => {
      this.startButtonElement.classList.add("clicked");
      gsap.delayedCall(0.5, () => {
        this.introContainerElement.style.display = "none";
      });

      this.experience.audioController.playMainSong();
      this.removeOverlay();
    };
    this.introContainerElement.appendChild(this.startButtonElement);
  };

  onProgress = (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    this.loadingBarElement.style.transform = `scaleX(${progressRatio})`;
    this.loadingTextElement.innerHTML = `${Math.round(progressRatio * 100)}%`;
  };

  onReady = () => {
    gsap.delayedCall(0.5, () => {
      this.removeLoadingInfo();
      gsap.delayedCall(0.5, () => {
        this.setStartButtonElement();
      });
    });
  };
}
