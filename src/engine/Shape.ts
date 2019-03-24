import Vector from './Vector'
import IVector from './interfaces/IVector'
import IDrawable from './interfaces/IDrawable'
import { context } from '@/store'
import IDimension from './interfaces/IDimension'
import ICoordinate from './interfaces/ICoordinate'
import ShapeStatus from '@/enums/ShapeStatus'

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
      if (!this.angle.equalsAngle(this.target.position)) {
        this.angle.converge(this.position, this.target.position)
      }
      if (this.collision(this.target)) {
        this.status = ShapeStatus.InCollision
        this.acceleration.reset()
        this.velocity.mul(0.92, 0.001)
      } else {
        this.acceleration = this.position.direction(this.target.position, 0.01)
      }
    }
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

  public getCoordinateArray(): ReadonlyArray<IVector> {
    const { a, b, c, d } = this.getCoordinates()
    return [a, b, c, d]
  }

  private collision(target: Shape): boolean {
    const shapes: Array<ReadonlyArray<IVector>> = [
      this.getCoordinateArray(),
      target.getCoordinateArray()
    ]

    const firstPositions: ReadonlyArray<IVector> = this.getCoordinateArray()
    const secondPositions: ReadonlyArray<IVector> = target.getCoordinateArray()

    let minA
    let maxA
    let projected
    let i
    let i1
    let j
    let minB
    let maxB

    for (i = 0; i < shapes.length; i++) {
      // for each polygon, look at each edge of the polygon, and determine if it separates
      // the two shapes
      const shape = shapes[i]
      for (i1 = 0; i1 < shape.length; i1++) {
        // grab 2 vertices to create an edge
        const i2 = (i1 + 1) % shape.length
        const p1 = shape[i1]
        const p2 = shape[i2]

        // find the line perpendicular to this edge
        const normal = {
          x: p2.y - p1.y,
          y: p1.x - p2.x
        }

        minA = maxA = undefined
        // for each vertex in the first shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        for (j = 0; j < firstPositions.length; j++) {
          projected =
            normal.x * firstPositions[j].x + normal.y * firstPositions[j].y

          if (!minA || projected < minA) {
            minA = projected
          }

          if (!maxA || projected > maxA) {
            maxA = projected
          }
        }

        // for each vertex in the second shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        minB = maxB = undefined
        for (j = 0; j < secondPositions.length; j++) {
          projected =
            normal.x * secondPositions[j].x + normal.y * secondPositions[j].y

          if (!minB || projected < minB) {
            minB = projected
          }

          if (!maxB || projected > maxB) {
            maxB = projected
          }
        }

        // if there is no overlap between the projects, the edge we are looking at separates the two
        // shapes, and we know there is no overlap
        if (
          minB !== undefined &&
          maxB !== undefined &&
          minA !== undefined &&
          maxA !== undefined &&
          (maxA < minB || maxB < minA)
        ) {
          return false
        }
      }
    }

    return true
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
}
