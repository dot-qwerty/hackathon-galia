import { Application, Sprite, Texture } from "pixi.js-legacy";
import { Tank } from "./Tank";

interface Player {
  id: number;
  pos: { x: number; y: number };
  connected: boolean;
  color: "blue" | "green" | "orange" | "purple";
  direction: "up" | "down" | "left" | "right";
}

interface Bullet {
  id: number;
  playerId: number;
  pos: { x: number; y: number };
  direction: string;
}

export class World {
  private app: Application;
  private squares: Map<number, Tank> = new Map();
  private bulletSprites: Map<number, Sprite> = new Map();
  private bulletTexture: Texture;

  constructor(app: Application) {
    this.app = app;
    this.bulletTexture = Texture.from('src/tank-sprites/bullet.png')
  }

  updatePlayers(players: Player[]) {
    for (const player of players) {
      let tank = this.squares.get(player.id);

      if (!tank) {
        tank = new Tank({
          initX: player.pos.x + 16,
          initY: player.pos.y + 16,
          direction: player.direction,
          variant: player.color,
        });
        this.app.stage.addChild(tank.container);
        this.squares.set(player.id, tank);
      }

      tank.update({
        newX: player.pos.x + 16,
        newY: player.pos.y + 16,
        newDirection: player.direction,
      });
      tank.container.alpha = player.connected ? 1 : 0;
    }
  }

  updatedBullets(bullets: Bullet[]) {
    const incomingIds = new Set(bullets.map(b => b.id))

    // Remove bullets no longer in state
    for (const [id, sprite] of this.bulletSprites) {
      if (!incomingIds.has(id)) {
        this.app.stage.removeChild(sprite)
        sprite.destroy()
        this.bulletSprites.delete(id)
      }
    }

    // Add or update bullets
    for (const bullet of bullets) {
      let sprite = this.bulletSprites.get(bullet.id)

      if (!sprite) {
        sprite = new Sprite(this.bulletTexture)
        sprite.anchor.set(0.5)
        this.app.stage.addChild(sprite)
        this.bulletSprites.set(bullet.id, sprite)
      }

      sprite.x = bullet.pos.x
      sprite.y = bullet.pos.y
    }
  }

  destroy() {
    this.app.stage.removeChildren();
    this.squares.clear();
    this.bulletSprites.clear();
  }
}