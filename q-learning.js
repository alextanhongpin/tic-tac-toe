const fs = require('fs')
const q = require('./train.json')
class TicTacToe {
  constructor (board) {
    this.board = board || Array(9).fill('.').join('')

    this.patterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6] // Diagonal
    ]

    this.scores = {
      xxx: -100,
      xx: -10,
      x: -1,
      default: -1,
      o: 1,
      oo: 10,
      ooo: 100
    }

    this.x = 'x'
    this.o = 'o'
    this.empty = '.'

    // We do not create the reward matrix - it is calculated on the run
    this.q = q
  }

  clone (board) {
    return [...board.split('')].join('')
  }

  computeScore (board) {
    return this.patterns.map(pattern => {
      return pattern.map(cell => board[cell]).join('')
    }).map(pattern => this.scores[pattern] !== undefined ? this.scores[pattern] : this.scores['default'])
    .reduce((a, b) => a + b, 0)
  }
  checkWin (board, player) {
    return this.patterns.map(pattern => {
      return pattern.map(cell => board[cell]).join('')
    }).some(pattern => pattern === Array(3).fill(player).join(''))
  }
  checkPossibleMoves (board) {
    return board.split('').map((cell, i) => {
      return cell === '.' ? i : null
    }).filter(x => x !== null)
  }
  move (board, player, move) {
    const cells = board.split('')
    cells[move] = player
    return cells.join('')
  }
  train () {
    // Create a new board
    const episodes = 100
    Array(episodes).fill(0).forEach(() => {
      let board = this.clone(this.board)
      let count = 0
      while (!this.checkWin(board, this.o) && count < 9) {
        if (!this.q[board]) {
          this.q[board] = {}
        }
        const possibleXMoves = this.checkPossibleMoves(board)
        if (!possibleXMoves.length) break
        const moveX = Math.floor(Math.random() * possibleXMoves.length)
        let newBoardX = this.move(board, this.x, possibleXMoves[moveX])
        count += 1

        const possibleYMoves = this.checkPossibleMoves(newBoardX)
        if (!possibleYMoves.length) break
        const moveY = Math.floor(Math.random() * possibleYMoves.length)
        let newBoardY = this.move(newBoardX, this.o, possibleYMoves[moveY])
        count += 1

        if (!this.q[newBoardX]) {
          this.q[newBoardX] = {}
        }
        if (!this.q[newBoardY]) {
          this.q[newBoardY] = {}
        }
        const futureActions = Object.values(this.q[newBoardY])
        const maxScore = futureActions.length ? Math.max(...futureActions) : this.computeScore(newBoardY)
        // console.log('maxScore', maxScore, futureActions, this.q[newBoardY], newBoardY)
        const score = this.computeScore(newBoardX)
        this.q[newBoardX][newBoardY] = score + 0.8 * maxScore
        board = newBoardY
      }
      console.log('end', board)
    })

    fs.writeFile('train.json', JSON.stringify(this.q), 'utf-8', (error, ok) => {
      if (error) {
        throw error
      }
      console.log('done')
    })
  }
}

const ticTacToe = new TicTacToe()

ticTacToe.train()

try {
  const move = predict('.xxoxo..o')
  console.log(move)
} catch (error) {
  console.log(error.message)
}
function predict (move) {
  const q = require('./train.json')
  const possibilities = q[move]
  return Object.entries(possibilities).find(([ key, value ]) => {
    return value === Math.max(...Object.values(possibilities))
  })[0]
}
