import Vector from './Vector'
import IVector from './interfaces/IVector'
import IDrawable from './interfaces/IDrawable'
import { context } from '@/store'
import IDimension from './interfaces/IDimension'
import ICoordinate from './interfaces/ICoordinate'
import ShapeStatus from '@/enums/ShapeStatus'
import collisionService from '@/services/CollisionService'

export default class Shape implements IDrawable {
  private static globalId: number = 0
  public id: number = ++Shape.globalId
  public width: number = 20
  public height: number = 60
  public color: string = ''
  public position: Vector = new Vector()
  public velocity: Vector = new Vector()
  public acceleration: Vector = new Vector()
  public angle: Vector = new Vector()
  public target: Shape | null = null
  public status: ShapeStatus = ShapeStatus.Idle

  public constructor(vector?: IVector, dimension?: IDimension) {
    this.position = new Vector(vector)
    this.angle.maxMagnitude = 1
    if (dimension) {
      this.width = dimension.width || 20
      this.height = dimension.height || 60
      this.color = dimension.color || ''
    }
  }

  public linkPosition(position: Vector) {
    this.position = position
  }

  public setTarget(target: Shape) {
    this.target = target
  }

  public update(): void {
    if (this.velocity.mag > 0) {
      this.status = ShapeStatus.Moving
    }
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration)
    if (this.target) {
      if (!this.inDirection) {
        if (this.stopped) {
          this.angle.converge(this.position, this.target.position)
        } else {
          this.slowDown(0.88)
        }
        return
      }
      if (this.collision(this.target)) {
        this.status = ShapeStatus.InCollision
        this.slowDown(0.92)
      } else {
        this.acceleration = this.position.direction(this.target.position, 0.01)
      }
    }
  }

  public slowDown(percent: number): void {
    this.acceleration.reset()
    this.velocity = this.velocity.mul(percent, 0.001)
  }

  public draw(): void {
    this.update()
    const ctx = context()
    if (!ctx) {
      return
    }
    ctx.beginPath()
    const { a, b, c, d } = this.getCoordinates()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(d.x, d.y)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  public getCoordinates(): ICoordinate {
    const { x, y } = this.position
    const h = this.height
    const w = this.width
    const angle = this.angle.angle
    const cosAngle = Math.cos(angle)
    const sinAngle = Math.sin(angle)

    const coord = {
      a: this.rotatePoint(
        this.position,
        {
          x: x - w / 2,
          y: y + h / 2
        },
        cosAngle,
        sinAngle
      ),
      b: this.rotatePoint(
        this.position,
        {
          x: x - w / 2,
          y: y - h / 2
        },
        cosAngle,
        sinAngle
      ),
      c: this.rotatePoint(
        this.position,
        {
          x: x + w / 2,
          y: y - h / 2
        },
        cosAngle,
        sinAngle
      ),
      d: this.rotatePoint(
        this.position,
        {
          x: x + w / 2,
          y: y + h / 2
        },
        cosAngle,
        sinAngle
      )
    }
    return coord
  }

  private getCoordinateArray(): ReadonlyArray<IVector> {
    const { a, b, c, d } = this.getCoordinates()
    return [a, b, c, d]
  }

  private collision(target: Shape): boolean {
    const firstPositions: ReadonlyArray<IVector> = this.getCoordinateArray()
    const secondPositions: ReadonlyArray<IVector> = target.getCoordinateArray()
    return collisionService.inCollision(firstPositions, secondPositions)
  }

  private rotatePoint(
    origin: IVector,
    point: IVector,
    cosAngle: number,
    sinAngle: number
  ): IVector {
    const x0 = origin.x
    const y0 = origin.y
    const { x, y } = point
    return {
      x: cosAngle * (x - x0) - sinAngle * (y - y0) + x0,
      y: sinAngle * (x - x0) + cosAngle * (y - y0) + y0
    }
  }

  private get stopped(): boolean {
    return this.velocity.mag === 0
  }

  private get inDirection(): boolean {
    if (!this.target) {
      return false
    }
    const angleDesired = this.target.position.substract(this.position)
    return this.angle.equalsAngle(angleDesired)
  }
}
