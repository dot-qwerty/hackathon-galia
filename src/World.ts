import { Application, Container, Sprite, Texture } from "pixi.js-legacy";
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

const COLOR_MAP: Record<string, number> = {
  blue:   0x4488ff,
  green:  0x44ff88,
  orange: 0xff8844,
  purple: 0xaa44ff,
}

export class World {
  private app: Application;
  private tankLayer: Container;
  private bulletLayer: Container;
  private squares: Map<number, Tank> = new Map();
  private bulletSprites: Map<number, Sprite> = new Map();
  private bulletTexture: Texture;
  private playerColors: Map<number, string> = new Map() // playerId -> color

  constructor(app: Application) {
    this.app = app;

    this.tankLayer = new Container()
    this.bulletLayer = new Container()
    this.app.stage.addChild(this.tankLayer)
    this.app.stage.addChild(this.bulletLayer)

    this.bulletTexture = Texture.from('src/tank-sprites/bullet.png')
  }

  updatePlayers(players: Player[]) {
    for (const player of players) {
      // Track color per player
      this.playerColors.set(player.id, player.color)

      let tank = this.squares.get(player.id);

      if (!tank) {
        tank = new Tank({
          initX: player.pos.x + 16,
          initY: player.pos.y + 16,
          direction: player.direction,
          variant: player.color,
        });
        this.tankLayer.addChild(tank.container);
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
    for (const sprite of this.bulletSprites.values()) {
      this.bulletLayer.removeChild(sprite)
      sprite.destroy()
    }
    this.bulletSprites.clear()

    for (const bullet of bullets) {
      const sprite = new Sprite(this.bulletTexture)
      sprite.anchor.set(0.5)
      sprite.x = bullet.pos.x
      sprite.y = bullet.pos.y

      // Tint bullet by owner's color
      const color = this.playerColors.get(bullet.playerId)
      sprite.tint = color ? COLOR_MAP[color] ?? 0xffffff : 0xffffff

      this.bulletLayer.addChild(sprite)
      this.bulletSprites.set(bullet.id, sprite)
    }
  }

  destroy() {
    this.app.stage.removeChildren();
    this.squares.clear();
    this.bulletSprites.clear();
    this.playerColors.clear();
  }
}