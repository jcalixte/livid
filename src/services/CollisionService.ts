import IVector from '@/engine/interfaces/IVector'

class CollisionService {
  public inCollision(
    firstPositions: ReadonlyArray<IVector>,
    secondPositions: ReadonlyArray<IVector>
  ): boolean {
    const shapes: Array<ReadonlyArray<IVector>> = [
      firstPositions,
      secondPositions
    ]

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
}

export default new CollisionService()
