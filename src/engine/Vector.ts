import IVector from './interfaces/IVector'

export default class Vector implements IVector {
  public x: number = 0
  public y: number = 0
  public maxMagnitude: number | undefined

  public get angle(): number {
    return Math.atan2(this.y, this.x)
  }

  public get mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  public constructor(vector?: IVector) {
    if (vector) {
      this.x = vector.x
      this.y = vector.y
      this.maxMagnitude = vector.maxMagnitude
    }
  }

  public clone(v: Vector) {
    return new Vector(v)
  }

  public equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y
  }

  public equalsAngle(v: Vector, precision: number = 2): boolean {
    return this.angle.toFixed(precision) === v.angle.toFixed(precision)
  }

  public isAround(v: Vector, around: number): boolean {
    return this.squareDist(v) < around ** 2
  }

  public reset(): void {
    this.x = 0
    this.y = 0
  }

  public add(v: Vector): void {
    this.x += v.x
    this.y += v.y

    if (this.maxMagnitude) {
      this.limit(this.maxMagnitude)
    }
  }

  public substract(v: Vector): Vector {
    return new Vector({
      x: this.x - v.x,
      y: this.y - v.y
    })
  }

  public mul(n: number, min?: number): Vector {
    const vector = new Vector(this)
    vector.x *= n
    vector.y *= n
    if (min) {
      if (Math.abs(vector.x) < min) {
        vector.x = 0
      }
      if (Math.abs(vector.y) < min) {
        vector.y = 0
      }
    }
    return vector
  }

  public div(n: number, min?: number): Vector {
    if (!n) {
      // tslint:disable-next-line:no-console
      console.error('can not divide by 0')
      throw { error: 'can not divide by 0' }
    }
    return this.mul(1 / n, min)
  }

  public converge(position: Vector, vector: Vector, step?: number): void {
    if (step) {
      this.add(vector.substract(position).mul(step))
    } else {
      const { x, y } = vector.substract(position)
      this.x = x
      this.y = y
    }
    if (this.maxMagnitude) {
      this.limit(this.maxMagnitude)
    }
  }

  public limit(limit: number): Vector {
    if (this.mag > limit) {
      return this.setMag(limit)
    }
    return this
  }

  public setMag(mag: number): Vector {
    const m: number = this.mag
    this.x = (this.x * mag) / m
    this.y = (this.y * mag) / m
    return new Vector({
      x: this.x,
      y: this.y
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

  public dist(v: Vector): number {
    return Math.sqrt(this.squareDist(v))
  }

  public squareDist(v: Vector): number {
    return (v.x - this.x) ** 2 + (v.y - this.y) ** 2
  }
}
