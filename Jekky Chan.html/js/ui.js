// ui.js
// Класс для управления UI-элементами игры
export class UI {
  constructor() {
    this.healthBar = document.getElementById("health-bar");
    this.energyBar = document.getElementById("energy-bar");
    this.healthText = document.getElementById("health-text");
    this.energyText = document.getElementById("energy-text");
    this.scoreText = document.getElementById("score-text");
    this.comboText = document.getElementById("combo-text");
  }

  updateHealth(current, max) {
    if (this.healthBar)
      this.healthBar.style.width = (100 * current) / max + "%";
    if (this.healthText) this.healthText.textContent = `${current}/${max}`;
  }

  updateEnergy(current, max) {
    if (this.energyBar)
      this.energyBar.style.width = (100 * current) / max + "%";
    if (this.energyText) this.energyText.textContent = `${current}/${max}`;
  }

  updateScore(score) {
    if (this.scoreText) this.scoreText.textContent = score;
  }

  updateCombo(combo) {
    if (this.comboText) this.comboText.textContent = combo;
  }

  setScore(score) {
    this.updateScore(score);
  }

  setCombo(combo) {
    this.updateCombo(combo);
  }

  setHealth(current, max) {
    this.updateHealth(current, max);
  }

  setEnergy(current, max) {
    this.updateEnergy(current, max);
  }
}
