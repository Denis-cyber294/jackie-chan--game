// physics.js
// Простая физика: гравитация, прыжки, столкновения с "землей"
export class Physics {
  constructor(gravity = 1, groundY = 448) {
    this.gravity = gravity;
    this.groundY = groundY; // Y-координата "земли"
  }
  apply(player) {
    // Гравитация
    player.vy += this.gravity;
    player.y += player.vy;
    // Столкновение с землей
    if (player.y >= this.groundY) {
      player.y = this.groundY;
      player.vy = 0;
      player.onGround = true;
    }
  }
}

// Применить физику ко всем врагам
export function applyPhysicsToEnemies(physics, enemies) {
  for (const enemy of enemies) {
    if (enemy.vy === undefined) enemy.vy = 0;
    if (enemy.onGround === undefined) enemy.onGround = false;
    enemy.vy += physics.gravity;
    enemy.y += enemy.vy;
    if (enemy.y >= physics.groundY) {
      enemy.y = physics.groundY;
      enemy.vy = 0;
      enemy.onGround = true;
    }
  }
}

// Проверка столкновения с платформами
export function checkPlatformCollision(player, platforms) {
  for (const pf of platforms) {
    // Проверяем только если игрок падает сверху
    if (
      player.vy >= 0 &&
      player.x + player.width > pf.x &&
      player.x < pf.x + pf.width &&
      player.y + player.height > pf.y &&
      player.y + player.height - player.vy <= pf.y + 4 // небольшой допуск
    ) {
      player.y = pf.y - player.height;
      player.vy = 0;
      player.onGround = true;
      return true;
    }
  }
  return false;
}

// Проверка нахождения на лестнице
export function checkLadder(player, ladders) {
  for (const ladder of ladders) {
    if (
      player.x + player.width > ladder.x &&
      player.x < ladder.x + ladder.width &&
      player.y + player.height > ladder.y &&
      player.y < ladder.y + ladder.height
    ) {
      return ladder;
    }
  }
  return null;
}

// Спавн врагов на уровне
export function spawnEnemies(level, resourceManager) {
  const enemies = [];
  if (level.enemies) {
    for (const e of level.enemies) {
      // Исправленный порядок аргументов: x, y, enemyType, resourceManager
      enemies.push(new e.type(e.x, e.y, e.enemyType, resourceManager));
    }
  }
  return enemies;
}

// Все ассеты должны быть добавлены в список загрузки ресурсов (см. game.js)
