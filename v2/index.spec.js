const {
  makeBoard,
  makeMove,
  checkGameState,
  minimax,
  alphaBeta
} = require('./tic-tac-toe')

describe('tic-tac-toe', () => {
  describe('.makeBoard', () => {
    it('creates an empty board', () => {
      expect(makeBoard()).toEqual(Array(9).fill(''))
    })
  })

  describe('.makeMove', () => {
    it('set the moves to the cell', () => {
      const board = makeBoard()
      const newBoard = makeMove(board, 'X', 0)
      expect(newBoard[0]).toEqual('X')
    })
  })

  describe('.checkGameState', () => {
    it('returns initial state', () => {
      const board = makeBoard()
      const state = checkGameState(board)
      expect(state.isWon).toBeFalsy()
      expect(state.isDraw).toBeFalsy()
      expect(state.humanWin).toBeFalsy()
      expect(state.enemyWin).toBeFalsy()
    })

    it('returns the draw state', () => {
      const board = ['x', 'o', 'x', 'o', 'x', 'o', 'o', 'x', 'o']
      const state = checkGameState(board)
      expect(state.isWon).toBeFalsy()
      expect(state.isDraw).toBeTruthy()
      expect(state.humanWin).toBeFalsy()
      expect(state.enemyWin).toBeFalsy()
    })

    it('returns the winning human state', () => {
      const board = ['x', 'x', 'x', 'o', 'o', '', '', '', '']
      const state = checkGameState(board)
      expect(state.isWon).toBeTruthy()
      expect(state.isDraw).toBeFalsy()
      expect(state.humanWin).toBeTruthy()
      expect(state.enemyWin).toBeFalsy()
    })

    it('returns the winning enemy state', () => {
      const board = ['x', 'x', 'o', 'o', 'o', 'o', 'x', '', '']

      const state = checkGameState(board)
      expect(state.isWon).toBeTruthy()
      expect(state.isDraw).toBeFalsy()
      expect(state.humanWin).toBeFalsy()
      expect(state.enemyWin).toBeTruthy()
    })
  })

  const testAlgo = algo => {
    const tests = [
      {
        board: ['x', 'x', 'o', 'o', 'o', '', 'x', 'x', ''],
        depth: 7,
        bestMove: 5
      },
      {
        board: ['x', 'x', '', 'o', 'o', '', 'x', '', ''],
        depth: 5,
        bestMove: 5
      },
      {
        board: ['x', 'o', '', 'x', '', '', '', '', ''],
        depth: 3,
        bestMove: 6
      }
    ]
    for (const { board, bestMove, depth } of tests) {
      const { move } = algo(board, depth, false)
      expect(move).toEqual(bestMove)
    }
  }
  describe('minimax', () => {
    it('returns the best move for enemy', () => {
      testAlgo(minimax)
    })
  })

  describe('alphaBeta', () => {
    it('returns the best move for enemy', () => {
      testAlgo(alphaBeta)
    })
  })
})

