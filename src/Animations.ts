import { Assets } from "pixi.js-legacy";
import muzzleFireGif from "./animations/muzzle-fire/muzzle-fire.gif";

type AnimationType = "muzzle-fire";

const AnimationAssets: Record<AnimationType, string> = {
  ["muzzle-fire"]: muzzleFireGif,
};

export const AnimationsBuffer: Record<AnimationType, undefined | ArrayBuffer> = {
  ["muzzle-fire"]: undefined,
};

export const loadAnimations = async () => {
  await Promise.all(
    Object.entries(AnimationAssets).map(async ([key, url]) => {
      const response = await fetch(url);
      AnimationsBuffer[key as AnimationType] = await response.arrayBuffer();
    }),
  );

  await Assets.load([
    'src/tank-sprites/blue-body.png',
    'src/tank-sprites/blue-turret.png',
    'src/tank-sprites/bullet.png',
    'src/tank-sprites/green-body.png',
    'src/tank-sprites/green-turret.png',
    'src/tank-sprites/orange-body.png',
    'src/tank-sprites/orange-turret.png',
    'src/tank-sprites/purple-body.png',
    'src/tank-sprites/purple-turret.png',
    'src/world-sprites/flag.png',
    'src/world-sprites/invincibility.png',
    'src/world-sprites/no-flag.png',
    'src/world-sprites/speedup.png',
    'src/world-sprites/wall.png',
  ])
};
