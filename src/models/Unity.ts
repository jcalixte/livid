import Shape from '@/engine/Shape'
import Vector from '@/engine/Vector'
import Circle from '@/engine/Circle'
import IDrawable from '@/engine/interfaces/IDrawable'
import IVector from '@/engine/interfaces/IVector'

export default class Unity implements IDrawable {
  public position: Vector = new Vector()
  public shape: Shape
  public fieldOfView: Circle = new Circle(100)
  public country: string

  constructor(country: string, position: IVector, color: string) {
    this.country = country
    this.position = new Vector(position)
    this.shape = new Shape(this.position, {
      width: 10,
      height: 100,
      color
    })
    this.shape.linkPosition(this.position)
    this.fieldOfView.linkPosition(this.position)
  }

  public setTarget(target: Unity) {
    this.shape.targetPoint = null
    this.shape.setTarget(target.shape)
  }

  public setTargetPoint(point: Vector) {
    this.shape.target = null
    this.shape.setTargetPoint(point)
  }

  public draw(): void {
    this.shape.draw()
    this.fieldOfView.draw()
  }
}
