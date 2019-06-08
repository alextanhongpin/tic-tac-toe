(function () {
  const defaultBoard = () => Array(9).fill(0).map((_, i) => i)
  class Board {
   static combinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    constructor (cells = defaultBoard()) {
      this.cells = cells
    }
    checkWin (player) {
      for (const [a, b, c] of Board.combinations) {
        if (this.cells[a] === player &&
        this.cells[b] === player &&
        this.cells[c] === player) {
          return true
        }
      }
      return false
    }
    copy () {
      return new Board([...this.cells])
    }
    move (player, position) {
      this.cells[position] = player
    }
    availableMoves () {
      return this.cells.filter((i) => typeof i === 'number')
    }
  }

  const nextPlayer = (player) => {
    if (player === 'x') return 'o'
    return 'x'
  }
  class TicTacToe {
    constructor () {
      this.board = new Board()
      this.turn = 0
    }
    move (player, position) {
      this.board.move(player, position)
      if (this.board.checkWin(player)) {
        window.alert(`Player ${player} win`)
        return
      }
      if (this.board.checkWin(nextPlayer(player))) {
        window.alert(`Player ${player} win`)
        return
      }
      this.turn++
      if (this.turn === 9) {
        window.alert('Game ended in draw')
      }
    }
  }

  function minimax (board, depth, player) {
    const isMaximizing = player === 'x'
    if (board.checkWin(player) || board.checkWin(nextPlayer(player))) {
      const result = {
        score: isMaximizing ? 10 - depth : -10 + depth,
        move: -1
      }
      return result
    }

    const scores = []
    const moves = board.availableMoves()
    if (!moves.length) {
      return {
        score: 0,
        move: -1
      }
    }
    for (const move of moves) {
      const boardCopy = board.copy()
      boardCopy.move(player, move)
      const result = minimax(boardCopy, depth + 1, nextPlayer(player))
      result.move = move
      scores.push(result)
    }

    // Maximizing player tries to minimize the loss.
    const sorted = scores.sort((l, r) =>
      // isMaximizing ? r.score - l.score : l.score - r.score)
      isMaximizing ? l.score - r.score : r.score - l.score)
    return sorted[0]
  }

  const ttt = new TicTacToe()
  const $cells = document.querySelectorAll('.cell')
  $cells.forEach(($el, index) => {
    $el.addEventListener('click', (evt) => {
      ttt.move('x', index)
      evt.target.innerHTML = 'x'

      if (ttt.turn === 9) {
        return
      }

      const { score, move } = minimax(ttt.board, ttt.turn, 'o')
      ttt.move('o', move)
      $cells[move].innerHTML = 'o'
    })
  })
})()
