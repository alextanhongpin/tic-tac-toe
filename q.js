class TicTacToe {
  constructor (q) {
    this.q = q
  }
  predict (move) {
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
  const ticTacToe = new TicTacToe(q)
  const $ticTacToe = document.getElementById('tictactoe')
  const $cells = $ticTacToe.querySelectorAll('div')

  const getBoardState = ($cells) => {
    let board = ''
    $cells.forEach($cell => {
      board += $cell.innerHTML || '.'
    })
    return board
  }
  $cells.forEach(($cell, i) => {
    $cell.addEventListener('click', (evt) => {
      if ($cell.innerHTML === 'x' || $cell.innerHTML === 'o') {
        return false
      }
      $cell.innerHTML = 'x'
      console.log(getBoardState($cells))
      const move = ticTacToe.predict(getBoardState($cells))
      $cells[move].innerHTML = 'o'
    }, false)
  })

}

main()
