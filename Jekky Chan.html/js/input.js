// input.js
// Класс для обработки ввода с клавиатуры
export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.punch = false;
    this.kick = false;
    this.special = false;
    this.chair = false;
    this.ladder = false;
    this.pickup = false;
    this._setupListeners();
  }

  _setupListeners() {
    window.addEventListener("keydown", (e) => this._onKey(e, true));
    window.addEventListener("keyup", (e) => this._onKey(e, false));
  }

  _onKey(e, isDown) {
    switch (e.code) {
      case "KeyA":
      case "ArrowLeft":
        this.left = isDown;
        break;
      case "KeyD":
      case "ArrowRight":
        this.right = isDown;
        break;
      case "KeyW":
      case "ArrowUp":
      case "Space":
        this.jump = isDown;
        break;
      case "KeyJ":
        this.punch = isDown;
        break;
      case "KeyK":
        this.kick = isDown;
        break;
      case "KeyL":
        this.special = isDown;
        break;
      case "KeyU":
        this.chair = isDown;
        break;
      case "KeyI":
        this.ladder = isDown;
        break;
      case "KeyE":
        this.pickup = isDown;
        break;
    }
  }
}
