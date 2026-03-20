import { Application, Container, Sprite, Texture } from "pixi.js-legacy";
import { Tank } from "./Tank";
import type { Bullet, Player } from "./types";

export class World {
  private readonly app: Application;
  private readonly tankLayer: Container;
  private readonly bulletLayer: Container;
  private readonly squares: Map<number, Tank> = new Map();
  private readonly bulletSprites: Map<number, Sprite> = new Map();
  private readonly bulletTexture: Texture;
  private readonly playerColors: Map<number, number> = new Map(); // playerId -> color

  constructor(app: Application) {
    this.app = app;

    this.tankLayer = new Container();
    this.bulletLayer = new Container();
    this.app.stage.addChild(this.tankLayer);
    this.app.stage.addChild(this.bulletLayer);

    this.bulletTexture = Texture.from("src/tank-sprites/bullet.png");
  }

  updatePlayers(players: Array<Player>, myPlayerId: undefined | number) {
    for (const player of players) {
      // Track color per player
      const randomColor = generateRandomColor();
      this.playerColors.set(player.id, randomColor);

      let tank = this.squares.get(player.id);

      if (!tank) {
        tank = new Tank({ color: randomColor });
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
      if (color === undefined)
        throw new Error("updatedBullets color not found");
      sprite.tint = color;

      this.bulletLayer.addChild(sprite);
      this.bulletSprites.set(bullet.id, sprite);
    }
  }

  destroy() {
    this.app.stage.removeChildren();
    this.squares.clear();
    this.bulletSprites.clear();
    this.playerColors.clear();
  }
}

function generateRandomColor() {
  return Math.floor(Math.random() * 0xffffff);
}
