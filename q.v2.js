const combinations = [
  [0, 1, 2], // Horizontal
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Vertical
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonal
  [2, 4, 6]
]

// sum returns the sum of an array
const sum = (x) => x.reduce((a, b) => a + b, 0)

// computeTotalScore returns the total score for each row of the board
function computeTotalScore (board) {
  const mapCellToRow = cell => board[cell]
  const mapRowsToCombination = rows => rows.map(mapCellToRow).join('')
  const scores = combinations.map(mapRowsToCombination).map(computeRowScore)
  return sum(scores)
}

// cloneBoard returns a new board at the present state
const cloneBoard = (board) => [...board.split('')].join('')

// computeRowScore returns the score for a particular row
function computeRowScore (row) {
  switch (row) {
    // case 'xxx': return 100
    // case 'xx': return 10
    // case 'x': return 1
    // case 'o': return -1
    // case 'oo': return -10
    // case 'ooo': return -100
    // A slightly modified version where draw will be penalized, and
    // ooo (machine move) will be rewarded. If player xxx wins, they
    // will get zero score
    case 'xxx': return 0
    case 'ooo': return 1
    default: return -0.5
  }
}

// checkPossibleMoves returns an array of moves that is possible for the players
function checkPossibleMoves (board) {
  const cells = board.split('')
  const mapEmptyCellToPosition = (cell, i) => cell === '.' ? i : null
  const filterNonNull = (value) => value !== null
  return cells.map(mapEmptyCellToPosition).filter(filterNonNull)
}

// checkWin returns true if any of the rows/columns/diagonals combinations
// contains a set of three x's or o's
function checkWin (board, player) {
  const winningPattern = Array(3).fill(player).join('')
  const mapCellToRow = cell => board[cell].join('')
  const mapCombinationsToRow = combination => combination.map(mapCellToRow)
  const isWinningPattern = pattern => pattern === winningPattern
  return combinations.map(mapCombinationsToRow).some(isWinningPattern)
}

// movePlayer returns a new board state with the players moved
function movePlayer (board, move, player) {
  const clonedBoard = cloneBoard(board)
  // To be implemented
}

function minimax () {

}
