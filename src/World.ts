import { Application, Graphics } from 'pixi.js-legacy'

const COLOR_MAP: Record<string, number> = {
  red: 0xff0000,
  blue: 0x0000ff,
  green: 0x00cc00,
  yellow: 0xffff00,
}

interface Player {
  id: number
  pos: { x: number; y: number }
  connected: boolean
  color: string
}

export class World {
  private app: Application
  private squares: Map<number, Graphics> = new Map()

  constructor(app: Application) {
    this.app = app
  }

  updatePlayers(players: Player[]) {
    for (const player of players) {
      let square = this.squares.get(player.id)

      if (!square) {
        square = new Graphics()
        square.beginFill(COLOR_MAP[player.color] ?? 0xffffff)
        square.drawRect(0, 0, 32, 32)
        square.endFill()
        this.app.stage.addChild(square)
        this.squares.set(player.id, square)
      }

      square.x = player.pos.x
      square.y = player.pos.y
      square.visible = player.connected
    }
  }

  destroy() {
    this.app.stage.removeChildren()
    this.squares.clear()
  }
}
