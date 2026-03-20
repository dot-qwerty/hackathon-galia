import { useEffect, useRef } from "react";
import { Application } from "pixi.js-legacy";
import { World } from "./World";
import { useWebSocket } from "./useWebSocket";
import type { Message } from "./types";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<undefined | World>(undefined);
  const myPlayerIdRef = useRef<undefined | number>(undefined);

  const onMessage = (message: Message) => {
    if (message?.type === "joined") {
      myPlayerIdRef.current = message.payload.playerId;
    } else if (message?.type === "state" && worldRef.current) {
      worldRef.current.updatePlayers(
        message.payload.players,
        myPlayerIdRef.current,
      );
      worldRef.current.updatedBullets(message.payload.bullets);
    }
  };

  useWebSocket(onMessage);

  useEffect(() => {
    const app = new Application({
      backgroundColor: 0xc2b280,
      width: 800,
      height: 800,
    });

    containerRef.current!.appendChild(app.view as HTMLCanvasElement);

    worldRef.current = new World(app);

    return () => {
      worldRef.current?.destroy();
      worldRef.current = undefined;
      app.destroy(true);
    };
  }, []);

  return <div ref={containerRef} />;
}

export default App;
