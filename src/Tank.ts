import { Container, Sprite, Text, TextStyle } from "pixi.js-legacy";
import { AnimatedGIF } from "@pixi/gif";
import { AnimationsBuffer } from "./Animations";
import type { Direction } from "./types";

export class Tank {
  readonly container = new Container();
  private readonly bodySprite: Sprite;
  private readonly turretSprite: Sprite;
  private muzzleFireAnimation: AnimatedGIF | undefined;
  private readonly variant: string;
  private readonly nameLabel: Text;

  constructor(props: { color: number; name: string }) {
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

    this.loadMuzzleFire();

    this.nameLabel = new Text(
      props.name.slice(0, 8),
      new TextStyle({
        fontSize: 17,
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        lineJoin: "round",
        align: "center",
      }),
    );
    this.nameLabel.anchor.set(0.5, 1);
    this.nameLabel.y = -22;

    this.container.addChild(this.bodySprite);
    this.container.addChild(this.turretSprite);
    this.container.addChild(this.nameLabel);
  }

  runFireAnimation() {
    if (this.muzzleFireAnimation === undefined) return;

    this.muzzleFireAnimation.currentFrame = 0;
    this.muzzleFireAnimation.alpha = 1;
    this.muzzleFireAnimation.onComplete = () => {
      if (this.muzzleFireAnimation === undefined) return;
      this.muzzleFireAnimation.alpha = 0;
    };
    this.muzzleFireAnimation.play();
  }

  update(props: { x: number; y: number; newDirection: Direction }) {
    this.container.x = props.x;
    this.container.y = props.y;
    this.rotateTurret(props.newDirection);
    this.rotateMuzzleFire(props.newDirection);
  }

  private loadMuzzleFire() {
    if (
      AnimationsBuffer["muzzle-fire"] === null ||
      this.muzzleFireAnimation !== undefined
    )
      return;

    this.muzzleFireAnimation = AnimatedGIF.fromBuffer(
      AnimationsBuffer["muzzle-fire"],
      { animationSpeed: 2, loop: false, autoPlay: false },
    );
    this.muzzleFireAnimation.anchor.set(0.5, 0);
    this.muzzleFireAnimation.alpha = 0;
    this.container.addChild(this.muzzleFireAnimation);
  }

  private rotateMuzzleFire(newDirection: Direction) {
    if (this.muzzleFireAnimation === undefined) return;

    const newMuzzleFirePositions = muzzleFirePositions[newDirection];
    this.muzzleFireAnimation.angle = newMuzzleFirePositions.angle;
    this.muzzleFireAnimation.x = newMuzzleFirePositions.x;
    this.muzzleFireAnimation.y = newMuzzleFirePositions.y;
  }

  private rotateTurret(newDirection: Direction) {
    this.rotateMuzzleFire(newDirection);
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

const muzzleFirePositions: Record<
  Direction,
  { angle: number; x: number; y: number }
> = {
  ["up"]: { angle: 180, x: 0, y: -28 },
  ["down"]: { angle: 0, x: 0, y: 20 },
  ["left"]: { angle: 90, x: -24, y: -4 },
  ["right"]: { angle: 270, x: 24, y: -4 },
};
