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
    if (!pattern) continue
    if (pattern === pattern[0].repeat(3)) return pattern[0]
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

const initialState = () => ({
  round: 0,
  board: makeBoard()
})

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

window.onload = main

function main () {
  const [state, setState] = makeGame()
  const $cells = document.querySelectorAll('.cell')

  const worker = new Worker('./worker.js')
  worker.onmessage = evt => {
    const { move } = evt.data
    $cells[move].innerText = cells.O
    setState(move)
  }

  $cells.forEach(($cell, pos) =>
    (pos => {
      $cell.addEventListener(
        'click',
        evt => {
          const $target = evt.currentTarget
          const text = $target.textContent.trim()
          if (text) return
          $cell.innerText = cells.X
          setState(pos)

          worker.postMessage(state)
        },
        false
      )
    })(pos)
  )
}
