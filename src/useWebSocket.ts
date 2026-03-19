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

    const send = (msg: { direction: string } | { action: string }) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(msg))
      }
    }

    ws.current.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data)
      } catch {
        onMessage?.(event.data)
      }
    }

    const pressed = new Set<string>()

    const onKeyDown = (e: KeyboardEvent) => {
      // Space — shoot
      if (e.code === 'Space') {
        e.preventDefault()
        send({ action: 'shoot' })
        return
      }

      const direction = DIRECTION_KEYS[e.key]
      if (!direction || pressed.has(e.key)) return
      pressed.add(e.key)
      send({ direction })
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const direction = DIRECTION_KEYS[e.key]
      if (!direction) return
      pressed.delete(e.key)

      if (pressed.size === 0) {
        send({ direction: 'stop' })
      } else {
        const lastKey = [...pressed].findLast(k => DIRECTION_KEYS[k])
        if (lastKey) send({ direction: DIRECTION_KEYS[lastKey] })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      ws.current?.close()
    }
  }, [onMessage])
}