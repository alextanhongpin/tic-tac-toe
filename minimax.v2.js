// minimax.v2.js contains tic-tac-toe with minimax + alpha-beta pruning

const HUMAN = 'x'
const ENEMY = 'o'

let isPlayerFirst = true
let combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function gameOver (player) {
  return function (board) {
    for (let i = 0, len = combinations.length; i < len; i += 1) {
      if (combinations[i]
        .map(i => board[i])
        .every(cell => cell === player)) {
        return true
      }
    }
    return false
  }
}

function minimax (board, depth, player, alpha = -Infinity, beta = Infinity) {
  if (gameOver(HUMAN)(board)) {
    return [10 - depth, -1]
  }

  if (gameOver(ENEMY)(board)) {
    return [depth - 10, -1]
  }

  let scores = []
  let moves = []

  for (let i = 0, len = board.length; i < len; i += 1) {
    if (board[i] === '') {
      board[i] = player
      let [bestScore] = minimax(board, depth + 1, player === HUMAN ? ENEMY : HUMAN, alpha, beta)
      scores.push(bestScore)
      moves.push(i)
      board[i] = ''

      // Maximizing player
      if (player === HUMAN) {
        alpha = bestScore > alpha ? bestScore : alpha
        if (alpha >= beta) break // beta cut-off
      } else {
        beta = bestScore < beta ? bestScore : beta
        if (alpha >= beta) break // alpha cut-off
      }
    }
  }

  let bestScore = player === HUMAN
    ? Math.max(...scores)
    : Math.min(...scores)
  let bestMove = moves[scores.indexOf(bestScore)]
  return [bestScore, bestMove]
}

(function main () {
  let board = Array(9).fill('')
  let depth = 0
  let cells = document.querySelectorAll('#tictactoe > div')
  let human = HUMAN
  let enemy = ENEMY

  if (!isPlayerFirst) {
    // Enemy move
    let [_, bestMove] = minimax(board, depth, enemy)
    depth++
    cells[bestMove].innerHTML = board[bestMove] = enemy
  }

  cells.forEach((element, index) => {
    element.addEventListener('click', (evt) => {
      let text = evt.currentTarget.innerHTML
      if (!text.trim().length) {
        // Player move
        depth++
        evt.currentTarget.innerHTML = board[index] = human

        console.time('minmax')
        // Enemy move
        let [_, bestMove] = minimax(board, depth, enemy)
        depth++
        cells[bestMove].innerHTML = board[bestMove] = enemy
        console.timeEnd('minmax')
      }
    }, false)
  })
})()
