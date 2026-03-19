import { Application, Graphics } from 'pixi.js-legacy'

export class World {
  private app: Application

  constructor(app: Application) {
    this.app = app
    this.init()
  }

  private init() {
    const rect = new Graphics()
    rect.beginFill(0x000000)
    rect.drawRect(0, 0, 32, 32)
    rect.endFill()

    this.app.stage.addChild(rect)
  }

  destroy() {
    this.app.stage.removeChildren()
  }
}
