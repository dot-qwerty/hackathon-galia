import { useEffect, useRef } from 'react'
import { Application } from 'pixi.js-legacy'
import { World } from './World'
import { useWebSocket } from './useWebSocket'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  useWebSocket()

  useEffect(() => {
    const app = new Application({
      width: 800,
      height: 800,
      backgroundColor: 0xffffff,
    })

    containerRef.current!.appendChild(app.view as HTMLCanvasElement)

    const world = new World(app)

    return () => {
      world.destroy()
      app.destroy(true)
    }
  }, [])

  return <div ref={containerRef} />
}

export default App
