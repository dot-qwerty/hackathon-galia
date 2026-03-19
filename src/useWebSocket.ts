import { useEffect, useRef } from 'react'

const WS_URL = 'ws://172.20.10.4:8080/ws'

const DIRECTION_KEYS: Record<string, string> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(WS_URL)

    const send = (msg: object) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(msg))
      }
    }

    const pressed = new Set<string>()

    const onKeyDown = (e: KeyboardEvent) => {
      const direction = DIRECTION_KEYS[e.key]
      if (!direction || pressed.has(e.key)) return
      pressed.add(e.key)
      send({ direction })
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const direction = DIRECTION_KEYS[e.key]
      if (!direction) return
      pressed.delete(e.key)
      send({ direction: 'stop' })
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      ws.current?.close()
    }
  }, [])

  return ws
}
