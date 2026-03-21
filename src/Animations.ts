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
};
