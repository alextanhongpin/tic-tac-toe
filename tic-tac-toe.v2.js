
function checkWin (board, player) {
  const winningPattern = Array(3).fill(player).join('')

  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  return combinations.map(patterns => patterns.map(pattern => board[pattern]).join(''))
  .some(pattern => pattern === winningPattern)
}

function checkBoardScore (board) {
  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  const scores = {
    xxx: 100,
    ooo: -100,
    xx: 10,
    x: 1,
    oo: -10,
    o: -1,
    default: 0
  }
  return combinations.map(patterns => patterns.map(pattern => board[pattern]).join(''))
  .map(board => board.split('').filter(cell => cell !== '.').join(''))
  .map(board => {
    return scores[board] !== undefined ? scores[board] : scores['default']
  }).reduce((a, b) => a + b, 0)
}
function checkScore (score = 0, depth, isMaximizing) {
  return isMaximizing ? score - depth : depth + score
}

function checkPlayer (isMaximizing) {
  return isMaximizing ? 'x' : 'o'
}

function minimax (board, depth, isMaximizing) {
  if (checkWin(board, checkPlayer(isMaximizing))) {
    return [checkScore(checkBoardScore(board), depth, isMaximizing), null]
  }
  let bestScore = isMaximizing ? -Infinity : +Infinity
  let bestMove = -1
  checkPossibleMoves(board).forEach((move) => {
    const newBoard = movePlayer(board, move, isMaximizing)
    const [newScore] = minimax(newBoard, depth - 1, isMaximizing)

    if (isMaximizing) {
      bestMove = newScore > bestScore ? move : bestMove
      bestScore = Math.max(bestScore, newScore)
    } else {
      bestMove = newScore < bestScore ? move : bestMove
      bestScore = Math.min(bestScore, newScore)
    }
  })
  return [ bestScore, bestMove ]
}

// function minimax (board, depth, isMaximizing) {
//   let bestScore = isMaximizing ? -Infinity : +Infinity
//   let bestMove = -1
//   const out = checkPossibleMoves(board).map((move) => {
//     const newBoard = movePlayer(board, move, isMaximizing)
//     const score = checkScore(checkBoardScore(newBoard), depth, isMaximizing)
//     if (isMaximizing) {
//       if (score > bestScore) {
//         bestScore = score
//         bestMove = move
//       }
//     } else {
//       if (score < bestScore) {
//         bestScore = score
//         bestMove = move
//       }
//     }

//     return [move, score]
//   })
//   console.log('out', out)

//   return [ bestScore, bestMove ]
// }

function movePlayer (board, position = -1, isMaximizing) {
  const moves = board.split('')
  moves[position] = checkPlayer(isMaximizing)
  return moves.join('')
}

function checkPossibleMoves (board) {
  return board.split('').map((move, i) => move === '.' ? i : null)
  .filter(nonNull => nonNull !== null)
}

function main () {
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

      console.log('getBoardState($cells)', getBoardState($cells))
      const indexOfBestMove = computeGame(getBoardState($cells))
      console.log(indexOfBestMove)
      $cells[indexOfBestMove].innerHTML = 'o'
    }, false)
  })
}

function computeGame (board) {
  const depth = 9 - board.split('').filter(pattern => pattern === '.').length
  const [ score, move ] = minimax(board, depth, false)
  console.log(`score=${score} move=${move}`)
  return move
}

main()
