import IDrawable from './interfaces/IDrawable'
import Vector from './Vector'
import { context } from '@/store'

export default class Circle implements IDrawable {
  public position: Vector = new Vector()
  public radius: number

  constructor(radius: number = 50) {
    this.radius = radius
  }

  public linkPosition(position: Vector) {
    this.position = position
  }

  public draw(): void {
    const ctx = context()
    if (!ctx) {
      return
    }
    ctx.beginPath()
    const { x, y } = this.position
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
    ctx.stroke()
  }
}
