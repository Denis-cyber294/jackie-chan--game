export const EnemyTypes = {
  THUG: {
    name: "Бандит",
    sprite: "enemy_thug",
    health: 40,
    speed: 2,
    attack: 8,
    ai: "melee",
  },
  ARMED_THUG: {
    name: "Вооружённый бандит",
    sprite: "armed_thug",
    health: 60,
    speed: 2.2,
    attack: 14,
    ai: "armed",
  },
  RANGED: {
    name: "Враг с дальними атаками",
    sprite: "ranged_thug",
    health: 35,
    speed: 2,
    attack: 10,
    ai: "ranged",
  },
  MARTIAL_ARTIST: {
    name: "Мастер боевых искусств",
    sprite: "martial_artist",
    health: 80,
    speed: 3,
    attack: 16,
    ai: "martial",
  },
  BOSS_BOUNCER: {
    name: "Вышибала",
    sprite: "bouncer_boss",
    health: 250,
    speed: 1.5,
    attack: 30,
    ai: "boss_bouncer",
  },
  BOSS_ASSASSIN: {
    name: "Ассасин",
    sprite: "assassin_boss",
    health: 180,
    speed: 4,
    attack: 18,
    ai: "boss_assassin",
  },
  BOSS_MASTER: {
    name: "Мастер",
    sprite: "master_boss",
    health: 300,
    speed: 2.5,
    attack: 22,
    ai: "boss_master",
  },
};

export class Enemy {
  constructor(x, y, enemyType, resourceManager) {
    this.x = x;
    this.y = y;
    this.type = enemyType;
    this.resourceManager = resourceManager;
    this.width = 96;
    this.height = 128;
    this.health = enemyType.health;
    this.maxHealth = enemyType.health;
    this.speed = enemyType.speed;
    this.attack = enemyType.attack;
    this.ai = enemyType.ai;
    this.isDefeated = false;
    this.vx = 0;
    this.vy = 0;
    this.state = "idle";
    this.stateTimer = 0;
  }
  takeHit() {
    this.state = "hit";
    this.stateTimer = 15; // 15 кадров эффект удара
  }
  attack() {
    this.state = "attack";
    this.stateTimer = 20; // 20 кадров анимация атаки
  }
  update(player) {
    if (this.stateTimer > 0) {
      this.stateTimer--;
      if (this.stateTimer === 0) {
        this.state = "idle";
      }
    }
    if (!this.isDefeated && player) {
      // AI: двигаться к игроку по X
      const dx = player.x - this.x;
      if (Math.abs(dx) > 10) {
        this.vx = dx > 0 ? this.speed : -this.speed;
      } else {
        this.vx = 0;
      }
      this.x += this.vx;
      // Атака, если близко к игроку по X и Y
      if (
        Math.abs(player.x - this.x) < 40 &&
        Math.abs(player.y - this.y) < 60 &&
        this.state !== "attack" &&
        !this.isDefeated
      ) {
        this.attack();
        if (!player.invulnerable) {
          player.health -= this.attack;
          player.invulnerable = 20; // 20 кадров неуязвимости
        }
      }
    }
  }
  draw(ctx) {
    let spriteKey = this.type.sprite;
    if (this.state === "hit") spriteKey += "_hit";
    else if (this.state === "attack") {
      // Особый случай для thug: атака = thug_punch
      if (spriteKey === "thug") spriteKey = "thug_punch";
      else spriteKey += "_attack";
    } else if (this.state === "idle") {
      // Особый случай для bouncer_boss: idle = bouncer_boss (без _idle)
      if (spriteKey === "bouncer_boss") {
        // ничего не добавляем
      } else {
        spriteKey += "_idle";
      }
    } else {
      spriteKey += "_idle";
    }
    const img = this.resourceManager?.getImage(spriteKey);
    if (img) {
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }
}
