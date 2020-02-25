const {
  isGameOver,
  isDraw,
  makeBoard,
  makeMove,
  makeGame,
  HUMAN,
  ENEMY
} = require('./index.js')

describe('tic-tac-toe', () => {
  it('should return a winning combination', () => {
    const board = makeBoard()
    board[0] = 'x'
    board[1] = 'x'
    board[2] = 'x'
    expect(isGameOver(board, 'x')).toBeTruthy()
  })

  it('should create a new board', () => {
    expect(makeBoard()).toEqual(['', '', '', '', '', '', '', '', ''])
  })

  it('should declare a draw when there are no moves', () => {
    const board = ['x', 'o', 'x', 'x', 'o', 'x', 'o', '', 'o']
    expect(isDraw(board)).toBeTruthy()
    expect(isDraw(makeBoard())).toBeFalsy()
  })

  it('should make a move', () => {
    const board = makeBoard()
    const newBoard = makeMove(board, 'x', 0)
    expect(newBoard).toEqual(['x', '', '', '', '', '', '', '', ''])
  })

  describe('should create a new game', () => {
    it('enemy starts first', () => {
      const game = makeGame({ firstPlayer: ENEMY })
      expect(game.score()).toEqual(0)

      const newGame = game.move(0)
      expect(newGame.board()).toEqual([ENEMY, '', '', '', '', '', '', '', ''])
      expect(newGame.score()).toEqual(0)

      const nextGame = newGame.move(1)
      expect(nextGame.board()).toEqual([
        ENEMY,
        HUMAN,
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ])
      expect(nextGame.score()).toEqual(0)
    })

    it('scores correctly', () => {
      const game = makeGame()
      const endGame = game
        .move(0)
        .move(3)
        .move(1)
        .move(4)
        .move(2)
      expect(endGame.score()).toEqual(5)
    })

    it('recommends the best move', () => {
      const game = makeGame()
      const midGame = game
        .move(0)
        .move(3)
        .move(1)
        .move(4)
      const minmax = midGame.minimax(midGame.state())
      const endGame = midGame.move(minmax.move)
      expect(endGame.isEndGame()).toBeTruthy()
    })
  })
})
