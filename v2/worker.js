const cells = Object.freeze({
  X: 'x',
  O: 'o',
  Empty: ''
})

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

const makeBoard = () => Array(9).fill(cells.Empty)

const makeMove = (board, player, move) => {
  if (board[move] !== cells.Empty) return board
  const copy = [...board]
  copy[move] = player
  return copy
}

// State.
const checkWinner = board => {
  for (const combination of COMBINATIONS) {
    const pattern = combination.map(pos => board[pos]).join('')
    if (pattern === cells.X.repeat(3)) return cells.X
    if (pattern === cells.O.repeat(3)) return cells.O
  }
  return cells.Empty
}

const isDraw = board => {
  const cellsFilled = board.filter(Boolean).length
  const winner = checkWinner(board)
  return cellsFilled >= 8 && !winner
}

const isEndGame = board =>
  checkWinner(board) === cells.X ||
  checkWinner(board) === cells.O ||
  isDraw(board)

const computeScore = state => {
  const winner = checkWinner(state.board)
  const scores = {
    [cells.X]: 10 - state.round,
    [cells.O]: -(10 - state.round),
    [cells.Empty]: 0
  }
  return scores[winner]
}

const initialState = () => ({
  round: 0,
  board: makeBoard()
})

const minimax = state => {
  const { board } = state
  if (isEndGame(board)) {
    return {
      score: computeScore(state),
      move: -1
    }
  }

  const results = []
  for (let i = 0; i < board.length; i += 1) {
    const cell = board[i]
    const isOccupied = cell !== cells.Empty
    if (isOccupied) continue

    const move = i

    const [tmpState, setTmpState] = makeGame(state)
    setTmpState(move)

    results.push({
      score: minimax(tmpState).score,
      move
    })
  }

  const isMaximizingPlayer = state.round % 2 === 0
  const scores = results.map(({ score }) => score)
  const targetScore = isMaximizingPlayer
    ? Math.max(...scores)
    : Math.min(...scores)
  return results.find(({ score }) => score === targetScore)
}

const makeGame = (params = initialState()) => {
  const state = {
    ...params,
    round: params.round,
    board: [...params.board]
  }

  const setMove = pos => {
    if (isEndGame(state.board)) {
      return
    }

    const player = state.round % 2 === 0 ? cells.X : cells.O
    state.round += 1
    state.board = makeMove(state.board, player, pos)
  }

  return [state, setMove]
}

onmessage = evt => {
  postMessage(minimax(evt.data))
}
