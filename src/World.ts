import { Application } from "pixi.js-legacy";
import { Tank } from "./Tank";

interface Player {
  id: number;
  pos: { x: number; y: number };
  connected: boolean;
  color: "blue" | "green" | "orange" | "purple";
  direction: "up" | "down" | "left" | "right";
}

export class World {
  private app: Application;
  private squares: Map<number, Tank> = new Map();

  constructor(app: Application) {
    this.app = app;
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

  destroy() {
    this.app.stage.removeChildren();
    this.squares.clear();
  }
}
