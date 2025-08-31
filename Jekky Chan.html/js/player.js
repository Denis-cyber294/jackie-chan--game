// Специальные атаки и взаимодействие с окружением для игрока
export class SpecialMoves {
  constructor(player) {
    this.player = player;
    this.drunkenActive = false;
    this.drunkenTimer = 0;
    this.chairActive = false;
    this.ladderActive = false;
  }
  activateDrunkenFist() {
    if (!this.drunkenActive && this.player.energy >= 30) {
      this.drunkenActive = true;
      this.drunkenTimer = 180; // 3 секунды
      this.player.energy -= 30;
      this.player.attackPower *= 1.7;
    }
  }
  update() {
    if (this.drunkenActive) {
      this.drunkenTimer--;
      if (this.drunkenTimer <= 0) {
        this.drunkenActive = false;
        this.player.attackPower /= 1.7;
      }
    }
  }
  useChairSpin() {
    // TODO: реализовать вращение со стулом (урон по области)
  }
  useLadderUppercut() {
    // TODO: реализовать апперкот с лестницей
  }
}

// Игрок
export class Player {
  constructor(resourceManager) {
    this.jumpPressed = false;
    this.invulnerable = 0;
    this.x = 100;
    this.y = 350;
    this.vx = 0;
    this.vy = 0;
    this.width = 96;
    this.height = 128;
    this.state = "idle";
    this.resourceManager = resourceManager;
    this.health = 100;
    this.maxHealth = 100;
    this.energy = 100;
    this.maxEnergy = 100;
    this.attackPower = 20;
    this.isAttacking = false;
    this.onGround = true;
    this.attackType = "punch"; // punch, kick, chair_spin, ladder_uppercut, drunken_fist
    this.attackTimer = 0;
    this.cooldowns = {
      punch: 0,
      kick: 0,
      chair_spin: 0,
      ladder_uppercut: 0,
      drunken_fist: 0,
    };
    this.cooldownTimes = {
      punch: 10, // минимальный
      kick: 18,
      chair_spin: 60, // максимальный
      ladder_uppercut: 40,
      drunken_fist: 32,
    };
  }
  update(input) {
    if (this.invulnerable > 0) this.invulnerable--;
    // Движение
    this.vx = 0;
    if (input.left) this.vx = -3;
    if (input.right) this.vx = 3;
    // Прыжок (только по одиночному нажатию)
    if (input.jump && this.onGround && !this.jumpPressed) {
      this.vy = -6; // ещё ниже прыжок
      this.onGround = false;
      this.jumpPressed = true;
    }
    if (!input.jump) {
      this.jumpPressed = false;
    }
    // Гравитация
    if (!this.onGround) {
      this.vy += 1; // ускорение вниз
      if (this.vy > 16) this.vy = 16;
    }
    // Смена состояния walk/idle
    if (this.vx !== 0) this.state = "walk";
    else this.state = "idle";
    // Обновление cooldowns
    for (const key in this.cooldowns) {
      if (this.cooldowns[key] > 0) this.cooldowns[key]--;
    }
    // Атаки
    if (!this.isAttacking) {
      if (input.punch && this.cooldowns.punch === 0) {
        this.isAttacking = true;
        this.attackType = "punch";
        this.attackPower = 20;
        this.state = "punch";
        this.attackTimer = 12;
        this.cooldowns.punch = this.cooldownTimes.punch;
      } else if (input.kick && this.cooldowns.kick === 0) {
        this.isAttacking = true;
        this.attackType = "kick";
        this.attackPower = 28;
        this.state = "kick";
        this.attackTimer = 16;
        this.cooldowns.kick = this.cooldownTimes.kick;
      } else if (input.chair && this.cooldowns.chair_spin === 0) {
        this.isAttacking = true;
        this.attackType = "chair_spin";
        this.attackPower = 50;
        this.state = "chair_spin";
        this.attackTimer = 24;
        this.cooldowns.chair_spin = this.cooldownTimes.chair_spin;
      } else if (input.ladder && this.cooldowns.ladder_uppercut === 0) {
        this.isAttacking = true;
        this.attackType = "ladder_uppercut";
        this.attackPower = 40;
        this.state = "ladder_uppercut";
        this.attackTimer = 20;
        this.cooldowns.ladder_uppercut = this.cooldownTimes.ladder_uppercut;
      } else if (input.special && this.cooldowns.drunken_fist === 0) {
        this.isAttacking = true;
        this.attackType = "drunken_fist";
        this.attackPower = 35;
        this.state = "drunken_fist";
        this.attackTimer = 18;
        this.cooldowns.drunken_fist = this.cooldownTimes.drunken_fist;
      }
    }
    // Таймер атаки
    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.state = this.vx !== 0 ? "walk" : "idle";
      }
    }
    // Движение
    this.x += this.vx;
    this.y += this.vy;
    // Отталкивание от границ экрана
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > 1024) this.x = 1024 - this.width;
    if (this.y + this.height > 576) {
      this.y = 576 - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }
  draw(ctx) {
    let spriteKey = "player_idle";
    if (this.state === "walk") spriteKey = "player_walk";
    else if (this.state === "punch") spriteKey = "player_punch";
    else if (this.state === "kick") spriteKey = "player_kick";
    else if (this.state === "chair_spin") spriteKey = "player_chair_spin";
    else if (this.state === "ladder_uppercut")
      spriteKey = "player_ladder_uppercut";
    else if (this.state === "drunken_fist") spriteKey = "player_drunken_fist";
    else if (this.state === "hit") spriteKey = "player_hit";
    else if (this.state === "defeated") spriteKey = "player_defeated";
    const img = this.resourceManager?.getImage(spriteKey);
    if (img) {
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }
}
