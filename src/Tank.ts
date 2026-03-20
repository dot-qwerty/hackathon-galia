import { Container, Sprite } from "pixi.js-legacy";

export class Tank {
  container = new Container();
  bodySprite: Sprite;
  turretSprite: Sprite;
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  variant: "blue" | "green" | "orange" | "purple";

  constructor(props: {
    initX: number;
    initY: number;
    direction: "up" | "down" | "left" | "right";
    variant: "blue" | "green" | "orange" | "purple";
  }) {
    this.x = props.initX;
    this.y = props.initY;
    this.direction = props.direction;
    this.variant = props.variant;

    this.bodySprite = Sprite.from(
      `/src/tank-sprites/blue-body.png`,
    );
    this.turretSprite = Sprite.from(
      `/src/tank-sprites/blue-turret.png`,
    );
    this.rotateTurret(props.direction);

    this.bodySprite.anchor.set(0.5);
    this.turretSprite.anchor.set(0.5, 0.25);
    this.turretSprite.y = -4;

    this.container.x = props.initX;
    this.container.y = props.initY;

    this.container.addChild(this.bodySprite);
    this.container.addChild(this.turretSprite);
  }

  update(props: {
    newX: number;
    newY: number;
    newDirection: "up" | "down" | "left" | "right";
  }) {
    this.x = props.newX;
    this.y = props.newY;
    this.direction = props.newDirection;

    this.container.x = props.newX;
    this.container.y = props.newY;
    this.rotateTurret(props.newDirection);
  }

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
