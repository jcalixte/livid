import IVector from '@/engine/interfaces/IVector'
import ICoordinate from '@/engine/interfaces/ICoordinate'
import Vector from '@/engine/Vector'
import Unity from '@/models/Unity'

class InteractionService {
  public isInUnities(point: IVector, unities: Unity[]): Unity | null {
    return (
      unities.find((unity: Unity) => {
        const { a, b, c }: ICoordinate = unity.shape.getCoordinates()
        const AB = Vector.createVector(a, b)
        const AP = Vector.createVector(a, point)
        const BC = Vector.createVector(b, c)
        const BP = Vector.createVector(b, point)
        const dotABAP = Vector.dot(AB, AP)
        const dotABAB = Vector.dot(AB, AB)
        const dotBCBP = Vector.dot(BC, BP)
        const dotBCBC = Vector.dot(BC, BC)
        return (
          0 <= dotABAP &&
          dotABAP <= dotABAB &&
          0 <= dotBCBP &&
          dotBCBP <= dotBCBC
        )
      }) || null
    )
  }
}

export default new InteractionService()
