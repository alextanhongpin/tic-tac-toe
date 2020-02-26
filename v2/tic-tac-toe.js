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

module.exports = {
  makeBoard,
  makeMove,
  checkGameState,
  minimax,
  alphaBeta
}
