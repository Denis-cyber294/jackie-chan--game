export class CombatSystem {
  constructor(player, enemies, ui, effects) {
    this.player = player;
    this.enemies = enemies;
    this.ui = ui;
    this.effects = effects;
    this.combo = 0;
    this.score = 0;
  }
  update() {
    // Проверка попадания игрока по врагам (простая зона удара)
    if (this.player.isAttacking) {
      this.enemies.forEach((enemy) => {
        if (!enemy.isDefeated && this.checkHit(this.player, enemy)) {
          // Урон зависит от типа атаки
          let damage = 0;
          switch (this.player.attackType) {
            case "punch":
              damage = 20;
              break;
            case "kick":
              damage = 28;
              break;
            case "chair_spin":
              damage = 50;
              break;
            case "ladder_uppercut":
              damage = 40;
              break;
            case "drunken_fist":
              damage = 35;
              break;
            default:
              damage = this.player.attackPower;
          }
          enemy.health -= damage;
          enemy.vx += enemy.x < this.player.x ? -6 : 6; // отталкивание
          this.combo++;
          this.score += 100;
          if (this.effects) {
            this.effects.spawnHit(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2
            );
          }
          if (enemy.health <= 0) {
            enemy.isDefeated = true;
            this.score += 500;
          }
        }
      });
    }
    // Обновление UI
    this.ui.setScore(this.score);
    this.ui.setCombo(this.combo);
  }
  // ...existing code...
}
