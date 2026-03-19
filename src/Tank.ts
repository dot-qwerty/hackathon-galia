import { Container, Sprite } from "pixi.js-legacy";

export class Tank {
  container = new Container();
  bodySprite: Sprite;
  turretSprite: Sprite;
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  variant: "blue" | "green" | "orange" | "purple";

  constructor(
    initX: number,
    initY: number,
    direction: "up" | "down" | "left" | "right",
    variant: "blue" | "green" | "orange" | "purple",
  ) {
    this.x = initX;
    this.y = initY;
    this.direction = direction;
    this.variant = variant;
    this.rotateTurret(direction);

    this.bodySprite = Sprite.from(`/src/tank-sprites/${variant}-body.png`);
    this.turretSprite = Sprite.from(`/src/tank-sprites/${variant}-turret.png`);

    this.bodySprite.anchor.set(0.5);
    this.turretSprite.anchor.set(0.5, 0.25);

    this.container.x = initX;
    this.container.y = initY;
  }

  update() {}

  private rotateTurret(newDirection: "up" | "down" | "left" | "right") {
    this.direction = newDirection;
    switch (this.direction) {
      case "up": {
        this.turretSprite.angle = 180;
        return;
      }
      case "down": {
        this.turretSprite.angle = 0;
        return;
      }
      case "left": {
        this.turretSprite.angle = 90;
        return;
      }
      case "right": {
        this.turretSprite.angle = 270;
        return;
      }
    }
  }
}
