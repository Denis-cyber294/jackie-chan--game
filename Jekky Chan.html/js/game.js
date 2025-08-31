// game.js
// Главный игровой класс, управление состояниями и циклами

import { ResourceManager } from "./resource.js";
import { Player, SpecialMoves } from "./player.js";
import { Input } from "./input.js";
import { Enemy, EnemyTypes } from "./enemy.js";
import { spawnEnemies } from "./physics.js";
import { UI } from "./ui.js";
import { CombatSystem } from "./combat.js";
import { EffectsManager } from "./effects.js";
import { Physics, applyPhysicsToEnemies } from "./physics.js";
import { levels } from "./level.js";
import { checkPlatformCollision, checkLadder } from "./physics.js";

export class Game {
  constructor() {
    // DOM-элементы экранов
    this.screens = {
      loading: document.getElementById("loading-screen"),
      menu: document.getElementById("main-menu"),
      controls: document.getElementById("controls-screen"),
      game: document.getElementById("game-screen"),
      pause: document.getElementById("pause-screen"),
      gameover: document.getElementById("game-over-screen"),
    };
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.state = "loading";
    this.player = null;
    this.input = null;
    this.enemies = [];
    this.ui = null;
    this.combat = null;
    this.physics = null;
    this.resourceManager = null;
    this.gameRunning = false;
    this.effects = new EffectsManager(this.resourceManager);
    this._bindUI();
  }

  init() {
    this.showScreen("loading");
    showLoadingScreen(0, 1);
    loadGameAssets(() => {
      hideLoadingScreen();
      this.showScreen("menu");
    }, this);
  }

  _bindUI() {
    // Кнопки главного меню
    const startBtn = document.getElementById("start-game");
    if (startBtn) startBtn.onclick = () => this.start();
    const controlsBtn = document.getElementById("controls");
    if (controlsBtn) controlsBtn.onclick = () => this.showScreen("controls");
    const aboutBtn = document.getElementById("about");
    if (aboutBtn)
      aboutBtn.onclick = () => alert("Jackie Chan Game\nDemo by Manus AI");
    const backToMenuBtn = document.getElementById("back-to-menu");
    if (backToMenuBtn) backToMenuBtn.onclick = () => this.showScreen("menu");
    // Кнопки паузы и game over
    const resumeBtn = document.getElementById("resume-game");
    if (resumeBtn) resumeBtn.onclick = () => this.resume();
    const restartBtn = document.getElementById("restart-game");
    if (restartBtn) restartBtn.onclick = () => this.start();
    const exitBtn = document.getElementById("exit-game");
    if (exitBtn) exitBtn.onclick = () => this.showScreen("menu");
    const playAgainBtn = document.getElementById("play-again");
    if (playAgainBtn) playAgainBtn.onclick = () => this.start();
    const backToMainMenuBtn = document.getElementById("back-to-main-menu");
    if (backToMainMenuBtn)
      backToMainMenuBtn.onclick = () => this.showScreen("menu");
    // ESC для паузы
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.state === "playing") {
        this.pause();
      }
    });
  }

  showScreen(name) {
    Object.entries(this.screens).forEach(([key, el]) => {
      if (el) el.classList.toggle("hidden", key !== name);
    });
    this.state = name;
  }

  start(levelIndex = 0) {
    this.currentLevel = levels[levelIndex];
    this.showScreen("game");
    this.state = "playing";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.input = new Input();
    this.player = new Player(this.resourceManager);
    this.player.special = new SpecialMoves(this.player);
    // --- Спавн врагов по уровню ---
    if (this.currentLevel.enemies) {
      this.enemies = spawnEnemies(this.currentLevel, this.resourceManager);
    } else {
      // Фолбэк: стандартные враги
      this.enemies = [
        new Enemy(this.resourceManager, 400, 350, EnemyTypes.THUG),
        new Enemy(this.resourceManager, 600, 350, EnemyTypes.ARMED_THUG),
        new Enemy(this.resourceManager, 700, 350, EnemyTypes.RANGED),
        new Enemy(this.resourceManager, 800, 350, EnemyTypes.MARTIAL_ARTIST),
        new Enemy(this.resourceManager, 900, 320, EnemyTypes.BOSS_BOUNCER),
      ];
    }
    this.ui = new UI();
    this.combat = new CombatSystem(
      this.player,
      this.enemies,
      this.ui,
      this.effects
    );
    this.physics = new Physics(1, 448);
    this.player.input = this.input;
    this.player.onGround = true;
    this.player.vy = 0;
    this.gameRunning = true;
    this.levelIndex = levelIndex;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.gameRunning) return;
    // --- Лестницы ---
    const ladder = checkLadder(this.player, this.currentLevel.ladders);
    if (ladder && (this.input.up || this.input.down)) {
      // Движение по лестнице
      this.player.vy = 0;
      if (this.input.up) this.player.y -= 4;
      if (this.input.down) this.player.y += 4;
      // Отключаем гравитацию
    } else {
      this.player.update(this.input);
      this.physics.apply(this.player);
      // --- Платформы ---
      if (!checkPlatformCollision(this.player, this.currentLevel.platforms)) {
        this.player.onGround = false;
      }
    }
    applyPhysicsToEnemies(this.physics, this.enemies);
    this.enemies.forEach((e) => e.update(this.player));
    this.combat.update();
    this.effects.update();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // --- Фон ---
    const bg = this.resourceManager.getImage(this.currentLevel.background);
    if (bg) this.ctx.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);
    // --- Платформы и лестницы (визуализация для отладки) ---
    this.ctx.save();
    this.ctx.globalAlpha = 0.2;
    this.ctx.fillStyle = "#0ff";
    for (const pf of this.currentLevel.platforms) {
      this.ctx.fillRect(pf.x, pf.y, pf.width, pf.height);
    }
    this.ctx.fillStyle = "#ff0";
    for (const ladder of this.currentLevel.ladders) {
      this.ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
    }
    this.ctx.restore();
    // --- Игрок, враги, эффекты, UI ---
    this.player.draw(this.ctx);
    this.enemies.forEach((e) => e.draw(this.ctx));
    this.effects.draw(this.ctx);
    this.ui.setHealth(this.player.health, this.player.maxHealth);
    this.ui.setEnergy(this.player.energy, this.player.maxEnergy);
    requestAnimationFrame(() => this.gameLoop());
  }

  // --- Смена уровня/фона ---
  nextLevel() {
    if (this.levelIndex + 1 < levels.length) {
      this.start(this.levelIndex + 1);
    }
  }

  pause() {
    if (this.state === "playing") {
      this.showScreen("pause");
      this.state = "paused";
    }
  }

  resume() {
    if (this.state === "paused") {
      this.showScreen("game");
      this.state = "playing";
    }
  }

  gameOver() {
    this.showScreen("gameover");
    this.state = "gameover";
  }
}

// --- Глобальные функции только для загрузки ассетов и экрана ---
let resourceManager;
function showLoadingScreen(progress, total) {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingText = document.getElementById("loading-text");
  const loadingProgress = document.getElementById("loading-progress");
  if (loadingScreen && loadingText && loadingProgress) {
    loadingScreen.style.display = "flex";
    loadingText.textContent = `Загрузка... ${progress} / ${total}`;
    const percent = total > 0 ? (progress / total) * 100 : 0;
    loadingProgress.style.width = percent + "%";
  }
}
function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) loadingScreen.style.display = "none";
}
function loadGameAssets(startGameCallback, gameInstance) {
  resourceManager = new ResourceManager();
  const images = [
    { key: "player_idle", src: "assets/jackie_chan_idle.png" },
    { key: "player_walk", src: "assets/jackie_chan_walk.png" },
    { key: "player_punch", src: "assets/jackie_chan_punch.png" },
    { key: "player_kick", src: "assets/jackie_chan_kick.png" },
    { key: "player_jump", src: "assets/jackie_chan_jump.png" },
    { key: "player_hit", src: "assets/jackie_chan_hit.png" },
    { key: "player_defeated", src: "assets/jackie_chan_defeated.png" },
    { key: "player_drunken_fist", src: "assets/jackie_chan_drunken_fist.png" },
    { key: "player_chair_spin", src: "assets/jackie_chan_chair_spin.png" },
    {
      key: "player_ladder_uppercut",
      src: "assets/jackie_chan_ladder_uppercut.png",
    },
    { key: "thug_idle", src: "assets/thug_idle.png" },
    { key: "thug_walk", src: "assets/thug_walk.png" },
    { key: "thug_punch", src: "assets/thug_punch.png" },
    { key: "thug_hit", src: "assets/thug_hit.png" },
    { key: "thug_defeated", src: "assets/thug_defeated.png" },
    { key: "armed_thug_idle", src: "assets/armed_thug_idle.png" },
    { key: "armed_thug_attack", src: "assets/armed_thug_attack.png" },
    { key: "ranged_thug_idle", src: "assets/ranged_thug_idle.png" },
    { key: "ranged_thug_attack", src: "assets/ranged_thug_attack.png" },
    { key: "martial_artist_idle", src: "assets/martial_artist_idle.png" },
    { key: "martial_artist_attack", src: "assets/martial_artist_attack.png" },
    { key: "bouncer_boss", src: "assets/bouncer_boss.png" },
    { key: "bouncer_boss_attack", src: "assets/bouncer_boss_attack.png" },
    { key: "breakable_crate", src: "assets/breakable_crate.png" },
    { key: "hit_effect", src: "assets/hit_effect.png" },
    { key: "explosion_effect", src: "assets/explosion_effect.png" },
    { key: "energy_bar", src: "assets/energy_bar.png" },
    { key: "health_bar", src: "assets/health_bar.png" },
    { key: "background_construction", src: "construction_site_background.png" },
    {
      key: "background_city",
      src: "assets/home/ubuntu/assets/city_street_background.png",
    },
    {
      key: "background_restaurant",
      src: "assets/home/ubuntu/assets/restaurant_background.png",
    },
    {
      key: "background_temple",
      src: "assets/home/ubuntu/assets/temple_dojo_background.png",
    },
    // Добавьте сюда новые ассеты, если появятся
  ];
  resourceManager.onProgress = showLoadingScreen;
  resourceManager.onComplete = () => {
    hideLoadingScreen();
    if (gameInstance) gameInstance.resourceManager = resourceManager;
    startGameCallback();
  };
  resourceManager.loadImages(images);
}

// --- Запуск игры ---
window.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.init();
});
