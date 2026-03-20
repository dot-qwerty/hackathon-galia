import { useCallback, useEffect, useRef, useState } from "react";
import { Application } from "pixi.js-legacy";
import { World } from "./World";
import { useWebSocket } from "./useWebSocket";
import type { Message } from "./types";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<undefined | World>(undefined);
  const myPlayerIdRef = useRef<undefined | number>(undefined);

  const [name, setName] = useState<undefined | string>(undefined);
  const [input, setInput] = useState("");

  const onMessage = useCallback((message: Message) => {
    if (message?.type === "joined") {
      myPlayerIdRef.current = message.payload.playerId;
    } else if (message?.type === "map" && worldRef.current) {
      worldRef.current.updateMap(message.payload.grid);
    } else if (message?.type === "state" && worldRef.current) {
      worldRef.current.updatePlayers(
        message.payload.players,
        myPlayerIdRef.current,
      );
      worldRef.current.updatedBullets(message.payload.bullets);
    }
  }, []);

  useWebSocket(name, onMessage);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new Application({
      backgroundColor: 0xc2b280,
      width: 800,
      height: 800,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);

    worldRef.current = new World(app);

    return () => {
      worldRef.current?.destroy();
      worldRef.current = undefined;
      app.destroy(true);
    };
  }, []);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) setName(trimmed);
  };

  return (
    <>
      {!name && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: "32px 40px",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minWidth: 280,
            }}
          >
            <h2 style={{ margin: 0, color: "#fff", fontSize: 20 }}>
              Enter your name
            </h2>
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Name..."
              style={{
                padding: "8px 12px",
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #444",
                background: "#2a2a2a",
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              style={{
                padding: "8px 12px",
                fontSize: 16,
                borderRadius: 4,
                border: "none",
                background: input.trim() ? "#4488ff" : "#333",
                color: "#fff",
                cursor: input.trim() ? "pointer" : "default",
              }}
            >
              Play
            </button>
          </div>
        </div>
      )}
      <div ref={containerRef} />
    </>
  );
}

export default App;
