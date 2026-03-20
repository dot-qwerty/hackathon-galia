import { Application, Container, Sprite, Texture } from "pixi.js-legacy";
import { Tank } from "./Tank";
import type { Bullet, Player } from "./types";

const TILE_SIZE = 32;

export class World {
  private readonly app: Application;
  private readonly mapLayer: Container;
  private readonly tankLayer: Container;
  private readonly bulletLayer: Container;
  private readonly squares: Map<number, Tank> = new Map();
  private readonly bulletSprites: Map<number, Sprite> = new Map();
  private readonly bulletTexture: Texture;
  private readonly wallTexture: Texture;
  private readonly playerColors: Map<number, number> = new Map();

  constructor(app: Application) {
    this.app = app;

    this.mapLayer = new Container();
    this.tankLayer = new Container();
    this.bulletLayer = new Container();
    this.app.stage.addChild(this.mapLayer);
    this.app.stage.addChild(this.tankLayer);
    this.app.stage.addChild(this.bulletLayer);

    this.bulletTexture = Texture.from('src/tank-sprites/bullet.png');
    this.wallTexture = Texture.from('src/world-sprites/wall.png');
  }

  updateMap(grid: number[][]) {
    this.mapLayer.removeChildren();
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 1) {
          const sprite = new Sprite(this.wallTexture);
          sprite.x = col * TILE_SIZE;
          sprite.y = row * TILE_SIZE;
          sprite.width = TILE_SIZE;
          sprite.height = TILE_SIZE;
          this.mapLayer.addChild(sprite);
        }
      }
    }
  }

  updatePlayers(players: Array<Player>, myPlayerId: undefined | number) {
    const activeIds = new Set(players.map(p => p.id));
    for (const [id, tank] of this.squares) {
      if (!activeIds.has(id)) {
        this.tankLayer.removeChild(tank.container);
        tank.destroy();
        this.squares.delete(id);
        this.playerColors.delete(id);
      }
    }

    for (const player of players) {
      // Track color per player
      const randomColor = generateRandomColor(player.id);
      this.playerColors.set(player.id, randomColor);

      let tank = this.squares.get(player.id);

      if (!tank) {
        tank = new Tank({ color: randomColor, name: player.name });
        this.tankLayer.addChild(tank.container);
        this.squares.set(player.id, tank);
      }

      tank.update({
        x: player.pos.x + 16,
        y: player.pos.y + 16,
        newDirection: player.direction,
      });
      tank.container.alpha = player.connected ? 1 : 0;

      // Camera: center screen on my tank, clamped to world edges
      if (player.id === myPlayerId) {
        const sw = this.app.screen.width;
        const sh = this.app.screen.height;
        const WORLD = 1024;
        const cx = sw / 2 - (player.pos.x + 16);
        const cy = sh / 2 - (player.pos.y + 16);
        this.app.stage.x = Math.min(0, Math.max(sw - WORLD, cx));
        this.app.stage.y = Math.min(0, Math.max(sh - WORLD, cy));
      }
    }
  }

  updatedBullets(bullets: Array<Bullet>) {
    for (const sprite of this.bulletSprites.values()) {
      this.bulletLayer.removeChild(sprite);
      sprite.destroy();
    }
    this.bulletSprites.clear();

    for (const bullet of bullets) {
      const sprite = new Sprite(this.bulletTexture);
      sprite.anchor.set(0.5);
      sprite.x = bullet.pos.x;
      sprite.y = bullet.pos.y;

      // Tint bullet by owner's color
      const color = this.playerColors.get(bullet.playerId);
      if (color === undefined) {
        throw new Error("updatedBullets color not found");
      }
      sprite.tint = color;

      this.bulletLayer.addChild(sprite);
      this.bulletSprites.set(bullet.id, sprite);
    }
  }

  destroy() {
    this.mapLayer.destroy({ children: true });
    this.tankLayer.destroy({ children: true });
    this.bulletLayer.destroy({ children: true });
    for (const [, square] of this.squares) square.destroy();
    for (const [, bulletSprite] of this.bulletSprites) {
      bulletSprite.destroy({ children: true });
    }
    this.bulletTexture.destroy();
    this.squares.clear();
    this.bulletSprites.clear();
    this.playerColors.clear();
    this.app.stage.removeChildren();
  }
}

function generateRandomColor(id: number) {
  const seed = (id * 2654435761) >>> 0  // Knuth multiplicative hash
  return seed % 0xffffff
}
