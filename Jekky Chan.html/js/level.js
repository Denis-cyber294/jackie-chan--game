// level.js
// Пример структуры уровня с платформами и лестницами
import { Enemy, EnemyTypes } from "./enemy.js";

export const Level1 = {
  background: "background_construction",
  platforms: [
    { x: 0, y: 520, width: 1024, height: 32 }, // земля
    { x: 320, y: 400, width: 200, height: 20 },
    { x: 700, y: 320, width: 120, height: 20 },
    { x: 500, y: 250, width: 80, height: 20 },
  ],
  ladders: [
    { x: 370, y: 420, width: 32, height: 120 }, // координаты должны совпадать с "строительными лесами" на construction_site_background.png
    { x: 750, y: 340, width: 32, height: 180 },
    { x: 540, y: 270, width: 32, height: 150 },
  ],
  enemies: [
    { type: Enemy, x: 400, y: 350, enemyType: EnemyTypes.THUG },
    { type: Enemy, x: 600, y: 350, enemyType: EnemyTypes.ARMED_THUG },
    { type: Enemy, x: 700, y: 350, enemyType: EnemyTypes.RANGED },
    { type: Enemy, x: 800, y: 350, enemyType: EnemyTypes.MARTIAL_ARTIST },
    { type: Enemy, x: 900, y: 320, enemyType: EnemyTypes.BOSS_BOUNCER },
  ],
};

export const Level2 = {
  background: "background_city",
  platforms: [
    { x: 0, y: 520, width: 1024, height: 32 },
    { x: 200, y: 350, width: 180, height: 20 },
    { x: 600, y: 420, width: 220, height: 20 },
  ],
  ladders: [], // нет лестниц на других фонах
};

export const levels = [Level1, Level2];
