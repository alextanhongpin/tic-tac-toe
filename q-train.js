const fs = require('fs')
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
const cloneBoard = board => [...board.split('')].join('')

// computeRowScore returns the score for a particular row
function computeRowScore (row) {
  switch (row) {
    // case 'xxx': return -100
    // case 'xx': return -10
    // case 'x': return -1
    // case 'o': return 1
    // case 'oo': return 10
    // case 'ooo': return 100
    // A slightly modified version where draw will be penalized, and
    // ooo (machine move) will be rewarded. If player xxx wins, they
    // will get zero score
    case 'xxx': return 1
    case 'ooo': return -1
    default: return 0
  }
}

// checkPossibleMoves returns an array of moves that is possible for the players
function checkPossibleMoves (board) {
  const cells = board.split('')
  const mapEmptyCellToPosition = (cell, i) => cell === Player.Empty() ? i : null
  const filterNonNull = (value) => value !== null
  return cells.map(mapEmptyCellToPosition).filter(filterNonNull)
}

// checkWin returns true if any of the rows/columns/diagonals combinations
// contains a set of three x's or o's
function checkWin (board, player) {
  const winningPattern = Array(3).fill(player).join('')
  const mapCellToRow = cell => board[cell]
  const mapCombinationsToRow = combination => combination.map(mapCellToRow).join('')
  const isWinningPattern = pattern => pattern === winningPattern
  return combinations.map(mapCombinationsToRow).some(isWinningPattern)
}

// movePlayer returns a new board state with the players moved
function movePlayer (board, move, player) {
  const clonedBoard = cloneBoard(board)
  // To be implemented
  const cells = clonedBoard.split('')
  cells[move] = player
  return cells.join('')
}

// // minimax returns the best move with the highest score for the different possible
// // moves that are available
// function minimax () {
//   // TODO: Handle draw conditions
// }

class Player {
  static Empty () {
    return '.'
  }
  static X () {
    return 'x'
  }
  static O () {
    return 'o'
  }
}

class TicTacToe {
  constructor ({q = {}, board = Array(9).fill(Player.Empty()).join('')}) {
    this.q = q // Our training model, can be loaded from a file
    this.board = board// The board initial state
    this.episodes = 10000 // Number of training
    this.alpha = 0.8 // Our rate of learning
    this.epsilon = 0.1 // Epsilon value to balance exploration/exploitation
    this.turn = 0
  }
  // TODO: Implement move
  getMove (board, player) {
    // if (Math.random() < this.episilon) {
      // Explore: Make a random move
    const possibleMoves = checkPossibleMoves(board)
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    // }
    // Exploit: Take the move with the highest scores
    // return 0
  }
  alternatePlayer (turn) {
    return this.turn % 2 === 0 ? Player.X() : Player.O()
  }
  train () {
    Array(this.episodes).fill(0).forEach(_ => {
      // Reset the board to the initial state each time
      this.turn = 0
      let board = cloneBoard(this.board)
      while (!checkWin(board) && this.turn < 9) {
        const player = this.alternatePlayer(this.turn)
        const bestMove = this.getMove(board, player)
        const finalBoard = movePlayer(board, bestMove, player)
        const finalScore = computeTotalScore(finalBoard)
        const futureScores = Object.values(this.q[finalBoard] ? this.q[finalBoard] : {})

        // Minimize the user's score if it is X (player) and maximize it if it is O (AI)
        const maxFutureScore = futureScores.length ? player === 'x' ? Math.min(...futureScores) : Math.max(...futureScores) : 0
        if (!this.q[board]) {
          this.q[board] = {}
          this.q[board][finalBoard] = {}
        }

        // Our Q-learning agent
        this.q[board][finalBoard] = finalScore + this.alpha * maxFutureScore
        this.turn += 1
        board = finalBoard
      }
    })
    console.log(this.q)
    fs.writeFile('train.json', JSON.stringify(this.q), 'utf-8', (error, ok) => {
      if (error) {
        console.log('error', error)
      }
      console.log('ok', ok)
    })
  }
  predict (move) {
    console.log('possible moves', this.q[move])
    const scores = Object.values(this.q[move])
    const moves = Object.entries(this.q[move])
    const minPlayerScore = Math.min(...scores)
    const bestMove = moves.find(([move, score]) => score === minPlayerScore)[0]
    return move.split('').map((m, i) => {
      return m === bestMove[i] ? null : i
    }).filter(nonNull => nonNull !== null)[0]
  }
}

// main is our program
async function main () {
  const q = require('./train.json')
  const ticTacToe = new TicTacToe({ q })

  // Uncomment this to train the model
  ticTacToe.train()
  const move = ticTacToe.predict('....x....')
  console.log('predicted:', move)
}

main()
