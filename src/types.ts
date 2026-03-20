export type Direction = "up" | "down" | "left" | "right";

export type Player = {
  id: number;
  pos: {
    x: number;
    y: number;
  };
  connected: boolean;
  direction: Direction;
  name: string;
};

export type Bullet = {
  id: number;
  playerId: number;
  pos: {
    x: number;
    y: number;
  };
  direction: Direction;
};

export type Message =
  | {
      type: "joined";
      payload: {
        playerId: number;
      };
    }
  | {
      type: "map";
      payload: {
        grid: number[][];
      };
    }
  | {
      type: "state";
      payload: {
        players: Array<Player>;
        bullets: Array<Bullet>;
      };
    };
