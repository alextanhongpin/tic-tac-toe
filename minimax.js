
const app = document.getElementById('tictactoe')
const divs = app.querySelectorAll('div')
const TicTacToe = {
  counter: 0,
  player () {
    return this.counter % 2 == 0 ? 'x' : 'o'
  },
  move () {
  	this.counter += 1
  },
  aiMoveFirst: Math.random() < 0.5
}

function humanMove (el) {
	 // Make a move
  	if (isWinningMove(getMoves())) {
  		console.log(TicTacToe.player() + ' won!')
  		return
  	}
  	TicTacToe.move()
  	el.innerHTML = TicTacToe.player()
}

function aiMove () {
  	const scores = generatePossibleMovesForPlayer(TicTacToe.player(), getMoves())
  	.map(totalScore)

  	const maxMove = scores.findIndex(i => i === Math.max(...scores))
  	const minMove = scores.findIndex(i => i === Math.min(...scores))

  	// AI MOVE
  	// AI is the maximizing user
  	divs.forEach((div, index) => {
  		// if (index === maximizingMove.index) {
  		if (TicTacToe.aiMoveFirst) {
	  		if (index === minMove) {
	  			TicTacToe.move()
	  			div.innerHTML = TicTacToe.player()
	  			return
  			}
  		} else {
  			if (index === maxMove) {
	  			TicTacToe.move()
	  			div.innerHTML = TicTacToe.player()
	  			return
	  		}
  		}
  	})
}

if (TicTacToe.aiMoveFirst) {
	// AI starts first
  console.log('ai move first')
  aiMove()
}

divs.forEach((div) => {
  div.addEventListener('click', (evt) => {
  	const current = evt.currentTarget.innerHTML
  	if (current !== '') {
  		return
  	}

  	humanMove(evt.currentTarget)
  	aiMove()

  	if (isWinningMove(getMoves())) {
  		console.log(TicTacToe.player() + ' won!')
  		return
  	}
  }, false)
})

function getMaxFromArray (data) {
  return data.sort((a, b) => a < b)[0]
}
function getMinFromArray (data) {
  return data.sort((a, b) => a < b)[data.length - 1]
}

function getMoves () {
  let str = ''
  divs.forEach((div) => {
  	const text = div.innerHTML || '-'
  	str += text
  })
  return str
}

function getCombinations (data) {
  const row1 = [data[0], data[1], data[2]].join('')
  const row2 = [data[3], data[4], data[5]].join('')
  const row3 = [data[6], data[7], data[8]].join('')
  const col1 = [data[0], data[3], data[6]].join('')
  const col2 = [data[1], data[4], data[7]].join('')
  const col3 = [data[2], data[5], data[8]].join('')

  const dia1 = [data[0], data[4], data[8]].join('')
  const dia2 = [data[2], data[4], data[6]].join('')

  return [
  	row1, row2, row3,
  	col1, col2, col3,
  	dia1, dia2
  ]
}

function generatePossibleMovesForPlayer (player, data) {
  const nextPlayer = player === 'x' ? 'o' : 'x'
  return Array(9).fill(0).map((m, i) => {
    const moves = data.split('')
    if (moves[i] === '-') {
      moves[i] = nextPlayer
    }
    return moves.join('')
  })
}

function isWinningMove (data) {
  return getCombinations(data).map(computeScore).some(i => Math.abs(i) === 100)
}
// totalScore returns the total score
// for each combinations (rows, columns and diagonals)
function totalScore (data) {
  return getCombinations(data).map(computeScore).reduce((a, b) => a + b, 0)
}

function computeScore (data) {
  const text = data.replace(/\-/g, '')
  switch (text) {
    case 'xxx': return 100
    case 'xx': return 10
    case 'x': return 1
    case 'o': return -1
    case 'oo': return -10
    case 'ooo': return -100
    default: return 0
  }
}
