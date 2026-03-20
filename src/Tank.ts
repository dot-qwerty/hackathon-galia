import {Container, Sprite, Text, TextStyle} from "pixi.js-legacy";
import type { Direction } from "./types";

export class Tank {
  readonly container = new Container();
  private readonly bodySprite: Sprite;
  private readonly turretSprite: Sprite;
  private readonly variant: string;
  private readonly nameLabel: Text;

  constructor(props: { color: number, name: string }) {
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

    this.nameLabel = new Text(props.name.slice(0, 8), new TextStyle({
      fontSize: 17,
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      lineJoin: 'round',
      align: 'center',
    }));
    this.nameLabel.anchor.set(0.5, 1);
    this.nameLabel.y = -22;

    this.container.addChild(this.bodySprite);
    this.container.addChild(this.turretSprite);
    this.container.addChild(this.nameLabel);
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
  }
}

/**
 *
 */
const variants = ["blue", "green", "orange", "purple"];

function getRandomVariant() {
  return variants[Math.floor(Math.random() * variants.length)];
}
