import Shape from './Shape'
import IDrawable from './interfaces/IDrawable'
import { context } from '@/store'

export default class Zone implements IDrawable {
  public anchor: Shape | null = null

  public constructor(anchor: Shape) {
    this.anchor = anchor
  }

  public draw(): void {
    const ctx = context()
    if (ctx) {
      ctx.beginPath()
      ctx.closePath()
    }
  }
}
