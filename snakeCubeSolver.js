'use strict'

const units = require('./src/unit-vectors')
const directions = require('./src/unit-names')

// vector operations
const add = (u, v) => [u[0] + v[0], u[1] + v[1], u[2] + v[2]]
const dot = (u, v) => u.reduce((sum, _, i) => sum + u[i] * v[i], 0)

const unitToPerp = units.reduce((acc, unit) => {
  acc[unit] = units.filter(u => dot(u, unit) === 0)
  return acc
}, {})

class Cube {
  constructor (size) {
    this.cube = Array.from(Array(size)).map(x => Array.from(Array(size)).map(y => [0, 0, 0]))
  }
  has (x, y, z) { return this.cube[x][y][z] === 1 }
  set (x, y, z) { this.cube[x][y][z] = 1 }
  unset (x, y, z) { this.cube[x][y][z] = 0 }
  isOutOfBounds (x, y, z) {
    const size = this.cube.length
    return x < 0 || y < 0 || z < 0 || size <= x || size <= y || size <= z
  }
}

// ///////////////////////////////////////////

const getNextDirections = (direction, toTurn) => {
  return toTurn ? unitToPerp[direction] : [direction]
}

const recursiveSnakeSolver = (cube, snake, snakeIndex, location, direction) => {
  if (snakeIndex === snake.length - 1) return []

  cube.set(...location)

  const newDirections = getNextDirections(direction, snake[snakeIndex])

  for (let i = 0, len = newDirections.length; i < len; i++) {
    const newLocation = add(location, newDirections[i])
    if (!cube.isOutOfBounds(...newLocation) && !cube.has(...newLocation)) {
      let res = recursiveSnakeSolver(cube, snake, snakeIndex + 1, newLocation, newDirections[i])
      if (res) return [newDirections[i]].concat(res)
    }
  }

  cube.unset(...location)
}

const startingPointsBySize = {
  3: [[0, 0, 0], [1, 1, 0], [1, 1, 1]],
  4: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1]]
}

const snakeSolver = (snake) => {
  const size = Math.cbrt(snake.length)
  const cube = new Cube(size)

  // for each starting point & direction
  return startingPointsBySize[size].reduce((result, startingPoint) => {
    return result || units.reduce((res, unit) => {
      return res || recursiveSnakeSolver(cube, snake, 0, startingPoint, unit)
    }, false)
  }, false)
}

// ////////////////////////////////////

const getInstructionsFromPath = (path) => {
  return path
    .map(vec => directions[vec])
    .filter((v, i, arr) => {
      return i === 0 || v !== arr[i - 1]
    })
}

// const snake = [0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0]
const snake = [0,0,1,1,0,1,1,1,0,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0]

const startTime = Date.now()
const res = snakeSolver(snake, 0, [0, 0, 0], units[0])

if (res) {
  console.log(`Solution took ${Date.now() - startTime} ms`)
  console.log(`------------------------------------------`)
  console.log(getInstructionsFromPath(res).join('\n'))
} else {
  console.log('no solution found')
}

