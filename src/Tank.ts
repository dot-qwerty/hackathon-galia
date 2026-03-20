import { Container, Sprite } from "pixi.js-legacy";
import type { Direction } from "./types";

export class Tank {
  readonly container = new Container();
  private readonly bodySprite: Sprite;
  private readonly turretSprite: Sprite;
  private readonly variant: string;

  constructor(props: { color: number }) {
    this.variant = getRandomVariant();

    this.bodySprite = Sprite.from(`/src/tank-sprites/${this.variant}-body.png`);
    this.turretSprite = Sprite.from(
      `/src/tank-sprites/${this.variant}-turret.png`,
    );

    this.bodySprite.anchor.set(0.5);
    this.bodySprite.tint = props.color;

    this.turretSprite.anchor.set(0.5, 0.25);
    this.turretSprite.y = -4;
    this.turretSprite.tint = props.color;

    this.container.addChild(this.bodySprite);
    this.container.addChild(this.turretSprite);
  }

  update(props: { x: number; y: number; newDirection: Direction }) {
    this.container.x = props.x;
    this.container.y = props.y;
    this.rotateTurret(props.newDirection);
  }

  private rotateTurret(newDirection: Direction) {
    switch (newDirection) {
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

  destroy() {
    this.container.destroy({ children: true });
    this.bodySprite.destroy({ children: true });
    this.turretSprite.destroy({ children: true });
  }
}

/**
 *
 */
const variants = ["blue", "green", "orange", "purple"];

function getRandomVariant() {
  return variants[Math.floor(Math.random() * variants.length)];
}
