'use strict'

const units = [
  [1, 0, 0], [-1, 0, 0],
  [0, 1, 0], [0, -1, 0],
  [0, 0, 1], [0, 0, -1]
]

const add = (x1, y1, z1, x2, y2, z2) => [x1 + x2, y1 + y2, z1 + z2]
const dot = (x1, y1, z1, x2, y2, z2) => x1 * x2 + y1 * y2 + z1 * z2

class Cube {
  constructor(size) {
    this.cube = Array.from(Array(size)).map(x => Array.from(Array(size)).map(y => [0,0,0]))
  }
  has(x, y, z) {
    return this.cube[x][y][z] === 1
  }
  set(x, y, z) {
    this.cube[x][y][z] = 1
  }
  unset(x, y, z) {
    this.cube[x][y][z] = 0
  }
}

const snakeSolver = (cube, snake, snakeIndex, currentPointer, currentPath) => {
  if (snakeIndex >= snake.length) {
    console.log('success!', JSON.stringify(currentPath))
    return
  }

  const newLocation = add(...currentPointer.location, ...currentPointer.direction)

  // if out of bounds
  if (newLocation[0] < 0 || newLocation[0] >= size
    || newLocation[1] < 0 || newLocation[1] >= size
    || newLocation[2] < 0 || newLocation[2] >= size) {
    return
  }

  // if already taken
  if (cube.has(...newLocation)) {
    return
  }

  cube.set(...newLocation)

  const newDirections = (snake[snakeIndex] === 0)
    ? [currentPointer.direction]
    : units.filter(unitVector => dot(...currentPointer.direction, ...unitVector) === 0)

  newDirections
    .forEach(newDirection => {
      const newPath = currentPath.concat([newDirection])
      snakeSolver(cube, snake, snakeIndex + 1, {
        location: newLocation,
        direction: newDirection
      }, newPath)
    })

  cube.unset(...newLocation)
}

// ////////////////////////////////////

const size = 3
const snake = [0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0]

snakeSolver(new Cube(size), snake, 1, { location: [0, 0, 0], direction: units[0] }, [])
