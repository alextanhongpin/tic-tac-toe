// const fs = require('fs')
// const q = require('./train.json')
class TicTacToe {
  constructor (board) {
    this.board = board || Array(9).fill('.').join('')

    this.patterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6] // Diagonal
    ]

    this.scores = {
      // xxx: -100,
      // xx: -10,
      // x: -1,
      // default: -1,
      // o: 1,
      // oo: 10,
      // ooo: 100
      ooo: 1,
      xxx: 0,
      default: 0.5
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
    const episodes = 10000
    Array(episodes).fill(0).forEach(() => {
      let board = this.clone(this.board)
      let count = 0
      while (!this.checkWin(board, this.o) && count < 9) {
        if (!this.q[board]) {
          this.q[board] = {}
        }
        const player = count % 2 === 0 ? this.x : this.o
        const possibleXMoves = this.checkPossibleMoves(board)
        if (!possibleXMoves.length) break
        const move = Math.floor(Math.random() * possibleXMoves.length)
        let newBoard = this.move(board, player, possibleXMoves[move])

        if (!this.q[newBoard]) {
          this.q[newBoard] = {}
        }
        const futureActions = Object.values(this.q[newBoard])
        const maxScore = futureActions.length ? Math.max(...futureActions) : this.computeScore(newBoard)
        // console.log('maxScore', maxScore, futureActions, this.q[newBoardY], newBoardY)
        const score = this.computeScore(newBoard)
        this.q[board][newBoard] = score + 0.8 * maxScore
        count += 1
        board = newBoard
      }

      console.log('end', board)
    })

    // fs.writeFile('train.json', JSON.stringify(this.q), 'utf-8', (error, ok) => {
    //   if (error) {
    //     throw error
    //   }
    //   console.log('done')
    // })
  }
}

function main () {
  const ticTacToe = new TicTacToe()

// ticTacToe.train()
  const $board = document.getElementById('tictactoe')
  const $cells = $board.querySelectorAll('div')

  const getBoardState = $cells => {
    let board = ''
    $cells.forEach($cell => {
      board += $cell.textContent ? $cell.textContent : '.'
    })
    return board
  }
  $cells.forEach(($cell, i) => {
    $cell.addEventListener('click', (evt) => {
      $cell.innerHTML = 'x'
      try {
        const original = getBoardState($cells)
        const move = predict(original)
        console.log(move)
        for (let i = 0; i < original.length; i += 1) {
          if (move[i] !== original[i]) {
            console.log(i)
            $cells[i].innerHTML = 'o'
          }
        }
      } catch (error) {
        console.log(error.message)
      }
      function predict (move) {
        // const q = require('./train.json')
        const possibilities = q[move]
        return Object.entries(possibilities).find(([ key, value ]) => {
          return value === Math.max(...Object.values(possibilities))
        })[0]
      }
    }, false)
  })
}

main()
