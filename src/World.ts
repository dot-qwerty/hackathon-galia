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

export class World {
  private app: Application;
  private tankLayer: Container;
  private bulletLayer: Container;
  private squares: Map<number, Tank> = new Map();
  private bulletSprites: Map<number, Sprite> = new Map();
  private bulletTexture: Texture;

  constructor(app: Application) {
    this.app = app;

    // tanks below, bullets on top
    this.tankLayer = new Container()
    this.bulletLayer = new Container()
    this.app.stage.addChild(this.tankLayer)
    this.app.stage.addChild(this.bulletLayer)

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
        this.tankLayer.addChild(tank.container);  // add to tank layer
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
  // Destroy all existing bullet sprites
  for (const sprite of this.bulletSprites.values()) {
    this.bulletLayer.removeChild(sprite)
    sprite.destroy()
  }
  this.bulletSprites.clear()

  // Recreate all bullets fresh
  for (const bullet of bullets) {
    const sprite = new Sprite(this.bulletTexture)
    sprite.anchor.set(0.5)
    sprite.x = bullet.pos.x
    sprite.y = bullet.pos.y
    this.bulletLayer.addChild(sprite)
    this.bulletSprites.set(bullet.id, sprite)
  }
}

  destroy() {
    this.app.stage.removeChildren();
    this.squares.clear();
    this.bulletSprites.clear();
  }
}