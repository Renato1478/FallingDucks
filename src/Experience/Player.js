import { Vec3 } from "cannon-es";
import { gsap } from "gsap";

import Duck from "./World/Duck.js";

const INITIAL_POSITION = {
  x: -20,
  y: 0.5,
  z: -1,
};

export default class Player {
  constructor() {
    // Positions
    this.linePosArr = [1, 0, -1, -2, -3, -4]; // Array of possible positions
    this.currentLinePosIndex = 2; // Index of current line
    this.isMoving = false;
    this.startedMoving = false;

    this.duck = new Duck(INITIAL_POSITION);

    // deactivated ducks to update
    this.deactivatedDucks = [];

    this.isGrounded = true; // Flag para verificar se o jogador está no ar

    this.velocityX = 2;

    // Jump
    this.jumpPower = 0; // Força do salto
    this.isChargingJump = false; // Flag para verificar se esta carregando pulo
    this.jumpIncrement = 2; // Incremento de intensidade do salto por milissegundo
    this.maxJumpPower = 32; // Máximo de intensidade de salto

    // Create a GSAP timeline for animating z position
    this.zPositionTimeline = gsap.timeline();

    // Adicione um evento de tecla para ouvir os comandos de tecla
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  reset() {
    this.deactivatedDucks.push(this.duck);

    this.duck = new Duck(INITIAL_POSITION, this.duck.model.clone());
    this.currentLinePosIndex = 2; // Index of current line
    this.isGrounded = true; // Flag para verificar se o jogador está no ar
    this.jumpPower = 0; // Força do salto
    this.isChargingJump = false; // Flag para verificar se esta carregando pulo
    this.isMoving = false;
  }

  // Método para lidar com pressionamento de tecla
  handleKeyDown(event) {
    switch (event.key) {
      case "a":
      case "A":
        this.moveLeft();
        break;
      case "d":
      case "D":
        this.moveRight();
        break;
      case " ":
        this.isChargingJump = true;
        break;
    }
  }

  // Método para lidar com a liberação de tecla
  handleKeyUp(event) {
    switch (event.key) {
      case " ":
        this.jump();
        break;
    }
  }

  // Método para mover para a direita
  moveRight() {
    if (this.isMoving || !this.isGrounded) return;

    if (this.currentLinePosIndex == this.linePosArr.length - 1) return;
    else {
      this.startedMoving = true;
      this.currentLinePosIndex += 1;
    }
  }

  // Método para mover para a esquerda
  moveLeft() {
    if (this.isMoving || !this.isGrounded) return;

    if (this.currentLinePosIndex == 0) return;
    else {
      this.startedMoving = true;
      this.currentLinePosIndex -= 1;
    }
  }

  // Método para realizar o salto
  jump() {
    if (this.isGrounded && this.jumpPower > 0) {
      this.isChargingJump = false;
      this.duck.physicsObject.body.applyForce(new Vec3(0, this.jumpPower, 0));
      // Verifique se o jogador não está no ar e a intensidade do salto é maior que zero
      this.isGrounded = false;
      // Implemente aqui a lógica para realizar o salto (por exemplo, alterar a posição vertical)
      this.jumpPower = 0; // Redefina a intensidade do salto
    }
  }

  // Method to smoothly animate the z position
  animateZPosition(targetZ) {
    this.zPositionTimeline.clear(); // Clear any previous animations
    this.zPositionTimeline.to(this.duck.physicsObject.body.position, {
      duration: 0.3, // Duration of the animation (adjust as needed)
      z: targetZ, // Target z position
      ease: "power1.inOut", // Easing function for smooth animation
    });
    this.isMoving = false;
  }

  update() {
    // Move the player with the river
    this.duck.physicsObject.body.position.x += this.velocityX / 60;

    this.deactivatedDucks.map((deactivatedDuck, i) => {
      if (deactivatedDuck.physicsObject.body.position.x > 25) {
        deactivatedDuck.destroy();
        this.deactivatedDucks.splice(i, 1);
      } else {
        deactivatedDuck.physicsObject.body.position.x += this.velocityX / 60;
      }
    });

    if (this.duck.physicsObject.body.position.y <= -0.95) {
      // Deactivate after x 0
      if (this.duck.physicsObject.body.position.x > 0) {
        this.reset();
        return;
      }

      this.isGrounded = true;

      // Update the z position smoothly
      if (this.startedMoving) {
        this.startedMoving = false;
        const targetZ = this.linePosArr[this.currentLinePosIndex];
        this.isMoving = true;
        this.animateZPosition(targetZ);
      }

      // Charging jump
      if (this.isChargingJump) {
        if (this.jumpPower < this.maxJumpPower) {
          this.jumpPower += this.jumpIncrement;
        }
      }
    } else {
      this.isGrounded = false;
    }
  }
}
