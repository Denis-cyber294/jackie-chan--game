// effects.js
// Система эффектов: искры/вспышки при ударе
export class HitEffect {
  constructor(x, y, resourceManager) {
    this.x = x;
    this.y = y;
    this.resourceManager = resourceManager;
    this.life = 18; // сколько кадров живёт эффект
    this.maxLife = 18;
    this.size = 64;
  }
  update() {
    this.life--;
  }
  draw(ctx) {
    const img = this.resourceManager.getImage("hit_effect");
    if (img && this.life > 0) {
      ctx.save();
      ctx.globalAlpha = this.life / this.maxLife;
      ctx.drawImage(
        img,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
      ctx.restore();
    }
  }
  isAlive() {
    return this.life > 0;
  }
}

export class EffectsManager {
  constructor(resourceManager) {
    this.effects = [];
    this.resourceManager = resourceManager;
  }
  spawnHit(x, y) {
    this.effects.push(new HitEffect(x, y, this.resourceManager));
  }
  update() {
    this.effects.forEach((e) => e.update());
    this.effects = this.effects.filter((e) => e.isAlive());
  }
  draw(ctx) {
    this.effects.forEach((e) => e.draw(ctx));
  }
}
