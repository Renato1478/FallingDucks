import { Vec3 } from "cannon-es";
import Duck from "./World/Duck.js";

export default class Player {
  constructor() {
    this.duck = new Duck();

    // Positions
    this.linePosArr = [1, 0, -1, -2, -3, -4]; // Array of possible positions
    this.currentLinePosIndex = 0; // Index of current line

    this.isGrounded = true; // Flag para verificar se o jogador está no ar

    this.velocityX = 1;

    // Jump
    this.jumpPower = 0; // Força do salto
    this.isChargingJump = false; // Flag para verificar se esta carregando pulo
    this.jumpIncrement = 2; // Incremento de intensidade do salto por milissegundo
    this.maxJumpPower = 32; // Máximo de intensidade de salto

    // Adicione um evento de tecla para ouvir os comandos de tecla
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
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

  // Método para mover para a esquerda
  moveLeft() {
    if (this.currentLinePosIndex == this.linePosArr.length - 1)
      this.currentLinePosIndex = 0;
    else this.currentLinePosIndex += 1;
  }

  // Método para mover para a direita
  moveRight() {
    if (this.currentLinePosIndex == 0)
      this.currentLinePosIndex = this.linePosArr.length - 1;
    else this.currentLinePosIndex -= 1;
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

  update() {
    // Move the player with the river
    this.duck.physicsObject.body.position.x += this.velocityX / 60;

    if (this.duck.physicsObject.body.position.y <= -0.95) {
      this.isGrounded = true;
      this.duck.physicsObject.body.position.z =
        this.linePosArr[this.currentLinePosIndex];

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
