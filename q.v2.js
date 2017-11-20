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
function sum (x) {
  return x.reduce((a, b) => a + b, 0)
}

// computeTotalScore returns the total score for each row of the board
function computeTotalScore (board) {
  const scores = combinations.map(rows => rows.map(cell => board[cell]).join('')).map(computeRowScore)
  return sum(scores)
}

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
  return board.split('')
  .map((cell, i) => {
    return cell !== '.' ? i : null
  })
  .filter((nonNull) => nonNull !== null)
}

// checkWin returns true if any of the rows/columns/diagonals combinations
// contains a set of three x's or o's
function checkWin (board, player) {
  const patterns = combinations.map(combination => combination.map(cell => board[cell].join('')))
  return patterns.some(pattern => pattern === Array(3).fill(player).join(''))
}

// cloneBoard returns a new board at the present state
function cloneBoard (board) {
  return [...board.split('')].join('')
}

function minimax () {

}
