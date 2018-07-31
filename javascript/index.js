const PLAYER = 'x'
const ENEMY = 'o'

const MINIMAX = 'minimax'
const ALPHABETA = 'alphabeta'
const algorithm = ALPHABETA
const enemyFirst = true

function main () {
  let state = Array(9).fill('')
  let cells = document.querySelectorAll('.cell')

  if (enemyFirst) {
    let depth = 9 - state.join('').length
    console.time('strategy')
    let [score, move] = algorithm === MINIMAX
      ? minimax(state, depth, false)
      : alphabeta(state, depth, -Infinity, Infinity, false)
    console.timeEnd('strategy')

    console.log(`AI calculated best move ${move} with score ${score}`)
    state[move] = ENEMY
    cells[move].innerHTML = ENEMY
  }

  cells.forEach((cell, i) => {
    cell.addEventListener('click', (evt) => {
      if (evt.currentTarget.innerHTML.trim() === '') {
        evt.currentTarget.innerHTML = PLAYER
        state[i] = PLAYER
        let depth = 9 - state.join('').length

        console.time('strategy')
        let [score, move] = algorithm === MINIMAX
          ? minimax(state, depth, false)
          : alphabeta(state, depth, -Infinity, Infinity, false)
        console.timeEnd('strategy')

        console.log(`AI calculated best move ${move} with score ${score}`)
        state[move] = ENEMY
        cells[move].innerHTML = ENEMY
      }
    })
  })
}

main()

function gameOver (state = []) {
  return getCombination(state)
    .some(pattern => pattern === 'xxx' || pattern === 'ooo')
}

function getCombination (state) {
  let rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ]
  let columns = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ]
  let diagonals = [
    [0, 4, 8],
    [2, 4, 6]
  ]
  return [...rows, ...columns, ...diagonals]
    .map(p => p.map(i => state[i]))
    .map(p => p.join(''))
}

function checkScore (state) {
  return getCombination(state)
    .map(mapScores)
    .reduce((score, n) => score + n, 0)
}

function mapScores (pattern) {
  let scores = {
    'x': 1,
    'o': -1,
    'xx': 10,
    'oo': -10,
    'xxx': 100,
    'ooo': -100
  }
  return scores[pattern] ? scores[pattern] : 0
}

function minimax (state = [], depth = 9, maximizingPlayer) {
  if (depth === 0 || gameOver(state)) {
    return [checkScore(state), -1]
  }

  let score = maximizingPlayer ? -Infinity : Infinity
  let move = -1
  state.forEach((n, i) => {
    if (n === '') {
      state[i] = maximizingPlayer ? PLAYER : ENEMY

      let [ bestScore ] = minimax(state, depth - 1, !maximizingPlayer)

      if (maximizingPlayer && bestScore > score) {
        score = bestScore
        move = i
      }

      if (!maximizingPlayer && bestScore < score) {
        score = bestScore
        move = i
      }
      // This won't work - the score can be the same, and it will be set to another move
      // score = maximizingPlayer
      //   ? Math.max(score, bestScore)
      //   : Math.min(score, bestScore)
      // move = score === bestScore ? i : move

      state[i] = ''
    }
  })
  return [score, move]
}

function alphabeta (state = [], depth = 9, alpha = -Infinity, beta = Infinity, maximizingPlayer = false) {
  if (depth === 0 || gameOver(state)) {
    return [checkScore(state), -1]
  }

  let score = maximizingPlayer ? -Infinity : Infinity
  let move = -1

  for (let i = 0; i < state.length; i += 1) {
    let n = state[i]
    if (n !== '') continue

    state[i] = maximizingPlayer ? PLAYER : ENEMY

    let [ bestScore ] = alphabeta(state, depth - 1, alpha, beta, !maximizingPlayer)

    score = maximizingPlayer
      ? Math.max(score, bestScore)
      : Math.min(score, bestScore)

    if (maximizingPlayer && score > alpha) {
      alpha = score
      move = i
    }

    if (!maximizingPlayer && score < beta) {
      beta = score
      move = i
    }

    state[i] = ''

    if (alpha >= beta) break
  }

  return [score, move]
}
