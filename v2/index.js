const moves = {
  X: 'x',
  O: 'o',
  None: ''
}

const COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const makeBoard = () => Array(9).fill('')

const makeMove = (board, player, move) => {
  const copy = [...board]
  copy[move] = player
  return copy
}

const checkGameState = board => {
  const hasWinner = (board, player) =>
    COMBINATIONS.map(combination =>
      combination.map(position => board[position] === player).every(Boolean)
    ).some(Boolean)

  const humanWin = hasWinner(board, moves.X)
  const enemyWin = hasWinner(board, moves.O)
  const isWon = humanWin || enemyWin
  const isDraw = board.filter(Boolean).length >= 8 && !isWon

  return {
    isWon,
    isDraw,
    enemyWin,
    humanWin
  }
}

const minimax = (board, depth, isMaximizingPlayer) => {
  const { isDraw, isWon, humanWin, enemyWin } = checkGameState(board)

  let score = 0
  if (humanWin) score = (10 - depth) * 1
  if (enemyWin) score = (10 - depth) * -1
  if (isWon || isDraw) return { move: -1, score }

  const player = isMaximizingPlayer ? moves.X : moves.O
  const bestMove = {
    score: isMaximizingPlayer ? -Infinity : Infinity,
    move: -1
  }

  for (const [move, cell] of board.entries()) {
    if (cell !== moves.None) continue

    const newBoard = makeMove(board, player, move)
    const currentMove = minimax(newBoard, depth + 1, !isMaximizingPlayer)
    if (
      (isMaximizingPlayer && currentMove.score > bestMove.score) ||
      (!isMaximizingPlayer && currentMove.score < bestMove.score)
    ) {
      bestMove.move = move
      bestMove.score = currentMove.score
    }
  }

  return bestMove
}

const alphaBeta = (
  board,
  depth,
  isMaximizingPlayer,
  alpha = -Infinity,
  beta = Infinity
) => {
  const { isDraw, isWon, humanWin, enemyWin } = checkGameState(board)

  let score = 0
  if (humanWin) score = (10 - depth) * 1
  if (enemyWin) score = (10 - depth) * -1
  if (isWon || isDraw) return { move: -1, score }

  const player = isMaximizingPlayer ? moves.X : moves.O
  const bestMove = {
    score: isMaximizingPlayer ? -Infinity : Infinity,
    move: -1
  }

  for (const [move, cell] of board.entries()) {
    if (cell !== moves.None) continue

    const newBoard = makeMove(board, player, move)
    const currentMove = alphaBeta(
      newBoard,
      depth + 1,
      !isMaximizingPlayer,
      alpha,
      beta
    )
    if (isMaximizingPlayer && currentMove.score > bestMove.score) {
      bestMove.move = move
      bestMove.score = currentMove.score
      if (bestMove.score > alpha) {
        alpha = bestMove.score
      }
    }
    if (!isMaximizingPlayer && currentMove.score < bestMove.score) {
      bestMove.move = move
      bestMove.score = currentMove.score
      if (bestMove.score < beta) {
        beta = bestMove.score
      }
    }
    if (beta <= alpha) {
      return bestMove
    }
  }

  return bestMove
}

window.onload = () => {
  const $cells = document.querySelectorAll('.cell')
  const $message = document.getElementById('message')

  const board = makeBoard()
  let round = 0
  const algo = alphaBeta // minimax
  const enemyFirst = false

  if (enemyFirst) {
    // Enemy move.
    const { move } = algo(board, round, false)
    board[move] = moves.O
    $cells[move].innerText = moves.O
    round += 1
    $message.innerText = 'Computer starts first'
  } else {
    $message.innerText = 'Your start first'
  }

  const updateMessage = board => {
    const { isDraw, humanWin, enemyWin } = checkGameState(board)
    if (isDraw) {
      $message.innerText = 'Game Draw'
      return true
    }
    if (humanWin) {
      $message.innerText = 'You Win'
      return true
    }

    if (enemyWin) {
      $message.innerText = 'Computer Win'
      return true
    }
    return false
  }

  $cells.forEach(($cell, i) =>
    (pos => {
      $cell.addEventListener(
        'click',
        evt => {
          const { isDraw, isWon } = checkGameState(board)
          if (isDraw || isWon) return
          if (board[pos] !== moves.None) return

          // Player move.
          board[pos] = moves.X
          $cell.innerText = moves.X
          round += 1
          if (updateMessage(board)) return
          $message.innerText = 'Computer turn'

          // Enemy move.
          const { move } = algo(board, round, false)
          board[move] = moves.O
          $cells[move].innerText = moves.O
          round += 1
          if (updateMessage(board)) return
          $message.innerText = 'Your turn'
        },
        false
      )
    })(i)
  )
}
