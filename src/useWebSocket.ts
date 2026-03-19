import { useEffect, useRef } from 'react'

const WS_URL = 'ws://172.20.10.4:8080/ws'
const DIRECTION_KEYS: Record<string, string> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

export function useWebSocket(onMessage?: (data: unknown) => void) {
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(WS_URL)

    const send = (msg: object) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(msg))
      }
    }

    // Listen for messages
    ws.current.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Received message:', data)
        onMessage?.(data)
      } catch {
        console.log('Received raw message:', event.data)
        onMessage?.(event.data)
      }
    }

    const pressed = new Set<string>()
    const onKeyDown = (e: KeyboardEvent) => {
      const direction = DIRECTION_KEYS[e.key]
      if (!direction || pressed.has(e.key)) return
      pressed.add(e.key)
      console.log('Sending direction', direction)
      send({ direction })
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const direction = DIRECTION_KEYS[e.key]
      if (!direction) return
      pressed.delete(e.key)
      console.log('======= STOP ==========')
      send({ direction: 'stop' })
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      ws.current?.close()
    }
  }, [onMessage])

  return ws
}