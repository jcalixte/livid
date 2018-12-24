import Vector from './Vector'
import IVector from './interfaces/IVector'
import IDrawable from './interfaces/IDrawable'
import { context } from '@/store'
import IDimension from './interfaces/IDimension'

export default class Shape implements IDrawable {
  public radius?: number = 20
  public width?: number = 20
  public height?: number = 60
  public color: string = ''
  public position: Vector = new Vector()
  public velocity: Vector = new Vector()
  public acceleration: Vector = new Vector()
  public target: Vector | null = null

  public constructor(vector?: IVector, dimension?: IDimension) {
    this.position = new Vector(vector)
    if (dimension) {
      this.radius = dimension.radius
      this.width = dimension.width
      this.height = dimension.height
      this.color = dimension.color || ''
    }
  }

  public setTarget(target: Vector) {
    this.target = target
  }

  public update(): void {
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration)
    if (this.target) {
      if (!this.position.equals(this.target)) {
        this.acceleration.reset()
      } else {
        this.acceleration = this.position.direction(this.target, 1)
      }
    }
  }

  public draw(): void {
    this.update()
    const ctx = context()
    if (ctx) {
      const { x, y } = this.position
      if (this.radius) {
        ctx.arc(x, y, this.radius || 50, 0, 2 * Math.PI)
      } else {
        ctx.beginPath()
        const a = {
          x: x - (this.width || 10) / 2,
          y: y - (this.height || 10) / 2
        }
        const b = {
          x: x + (this.width || 10) / 2,
          y: y - (this.height || 10) / 2
        }
        const c = {
          x: x + (this.width || 10) / 2,
          y: y + (this.height || 10) / 2
        }
        const d = {
          x: x - (this.width || 10) / 2,
          y: y + (this.height || 10) / 2
        }
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.lineTo(c.x, c.y)
        ctx.lineTo(d.x, d.y)
      }
      ctx.fillStyle = this.color || '#0580af'
      ctx.fill()
    }
  }
}
