import IVector from './IVector'
import ICoordinate from './ICoordinate'

export default interface IShape {
  width: number
  height: number
  position: IVector
  angle: IVector
  getCoordinates(): ICoordinate
}
