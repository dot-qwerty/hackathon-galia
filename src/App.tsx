import { useEffect, useRef } from 'react'
import { Application } from 'pixi.js-legacy'
import { World } from './World'
import { useWebSocket } from './useWebSocket'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<World | null>(null)

  const onMessage = (data: unknown) => {
    const msg = data as { type: string; payload: { 
      players: Parameters<World['updatePlayers']>[0], 
      bullets: Array<{ "id": number, "playerId": number, "pos": { "x": number, "y": number }, "direction": string }>
     } 
    }
    if (msg?.type === 'state' && worldRef.current) {
      worldRef.current.updatePlayers(msg.payload.players)
    }
  }

  useWebSocket(onMessage)

  useEffect(() => {
    const app = new Application({
      backgroundColor: 'dodgerblue',
      width: 800,
      height: 800,
    })

    containerRef.current!.appendChild(app.view as HTMLCanvasElement)

    worldRef.current = new World(app)

    return () => {
      worldRef.current?.destroy()
      worldRef.current = null
      app.destroy(true)
    }
  }, [])

  return <div ref={containerRef} />
}

export default App
