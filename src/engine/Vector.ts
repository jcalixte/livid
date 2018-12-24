import IVector from './interfaces/IVector'

export default class Vector implements IVector {
  public x: number = 0
  public y: number = 0

  public get mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  public constructor(vector?: IVector) {
    if (vector) {
      this.x = vector.x
      this.y = vector.y
    }
  }

  public equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y
  }

  public reset(): void {
    this.x = 0
    this.y = 0
  }

  public add(v: Vector): void {
    this.x += v.x
    this.y += v.y
  }

  public substract(v: Vector): void {
    this.x -= v.x
    this.y -= v.y
  }

  public div(n: number): void {
    if (!n) {
      // tslint:disable-next-line:no-console
      console.log('can not divide by 0')
      return
    }
    this.x /= n
    this.y /= n
  }

  public setMag(mag: number): Vector {
    const m: number = this.mag
    return new Vector({
      x: (this.x * mag) / m,
      y: (this.y * mag) / m
    })
  }

  public direction(v: Vector, limit?: number): Vector {
    const newVector = new Vector({
      x: v.x - this.x,
      y: v.y - this.y
    })
    if (limit && limit < this.mag) {
      return newVector.setMag(limit)
    }
    return newVector
  }

  public to(v: Vector): void {
    this.x = v.x - this.x
    this.y = v.y - this.y
  }
}
