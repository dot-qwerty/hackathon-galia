import { useCallback, useEffect, useRef, useState } from "react";
import { Application } from "pixi.js-legacy";
import { World } from "./World";
import { useWebSocket } from "./useWebSocket";
import { loadAnimations } from "./Animations";
import type { Message } from "./types";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<undefined | World>(undefined);
  const myPlayerIdRef = useRef<undefined | number>(undefined);

  const [name, setName] = useState<undefined | string>(undefined);
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<Array<{ playerId: number; name: string; frags: number }>>([]);

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
      worldRef.current.updatedBullets(
        message.payload.bullets,
        myPlayerIdRef.current,
      );
    } else if (message?.type === "stats") {
      setStats([...message.payload].sort((a, b) => b.frags - a.frags));
    }
  }, []);

  useWebSocket(name, onMessage);

  useEffect(() => {
    if (!containerRef.current) return;

    let app: undefined | Application = undefined;

    async function init() {
      if (!containerRef.current) return;
      
      await loadAnimations();

      app = new Application({
        backgroundColor: 0xc2b280,
        width: 800,
        height: 800,
      });
  
      containerRef.current.appendChild(app.view as HTMLCanvasElement);
  
      worldRef.current = new World(app);
  
    }

    init();


    return () => {
      worldRef.current?.destroy();
      worldRef.current = undefined;
      app?.destroy(true);
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
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div ref={containerRef} />
        <div style={{
          marginLeft: 16,
          minWidth: 180,
          background: "#1a1a1a",
          borderRadius: 8,
          overflow: "hidden",
          color: "#fff",
          fontFamily: "monospace",
        }}>
          <div style={{
            padding: "8px 12px",
            background: "#2a2a2a",
            fontWeight: "bold",
            fontSize: 13,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}>
            Scoreboard
          </div>
          {stats.length === 0 ? (
            <div style={{ padding: "8px 12px", color: "#666", fontSize: 13 }}>No data yet</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ color: "#888", borderBottom: "1px solid #333" }}>
                  <th style={{ padding: "6px 12px", textAlign: "left", fontWeight: "normal" }}>#</th>
                  <th style={{ padding: "6px 12px", textAlign: "left", fontWeight: "normal" }}>Name</th>
                  <th style={{ padding: "6px 12px", textAlign: "right", fontWeight: "normal" }}>Frags</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s, i) => (
                  <tr key={s.playerId} style={{
                    borderBottom: "1px solid #2a2a2a",
                    background: s.playerId === myPlayerIdRef.current ? "#1e3a5f" : "transparent",
                  }}>
                    <td style={{ padding: "6px 12px", color: "#666" }}>{i + 1}</td>
                    <td style={{ padding: "6px 12px" }}>{s.name}</td>
                    <td style={{ padding: "6px 12px", textAlign: "right", color: "#4488ff", fontWeight: "bold" }}>{s.frags}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
