'use strict';



const divs = [...document.querySelectorAll('#tictactoe div')];

const state = {
	moves: Array(9).fill(null),
	// row1-3, col1-3, diag1-2
	scores: Array(8).fill(0),
	movesRemaining: 9,
	currentPlayer: 'x',
	nextPlayer: 'o',
}

divs.map((div, index) => {
	div.addEventListener('click', (evt) => {
		const text = evt.currentTarget.textContent;
		if (text) return false;
		state.moves[index] = state.currentPlayer;
		evt.currentTarget.textContent = state.currentPlayer;


	
		//minmax(state);
	}, false);
});


 function swapPlayer(current) {
 	if (current == 'x') return 'o';
 	else return 'x';
 }

 function swapPlayerStates(prevState) {

 	if (prevState.currentPlayer === 'x') {
		prevState.previousPlayer = 'x';
		prevState.currentPlayer = 'o';
		prevState.nextPlayer = 'x';
	} else {
		prevState.previousPlayer = 'o';
		prevState.currentPlayer = 'x';
		prevState.nextPlayer = 'o';
	}
	return prevState;
 }

 function minmax(props) {
 	//console.log(props);
 	props = swapPlayerStates(props);
 	props.movesRemaining = remainingMoves(props.moves);
	const scores = computeScores(props);
 	console.log(scores)
 	const totalScores = computeTotalScores(scores);
 	console.log(totalScores)

 	const copy = Object.assign({}, props);
	const move = computeMove(copy, props.previousPlayer)

 	console.log(move)

 	// let mostFavourable = +999;
 	// let best = {}
 	// let poss = move.possibilities;
 	// while (poss) {

 	// 	pass.forEach(m => {

 	// 	})

 	// }
	divs[move.bestMove].textContent = props.currentPlayer;

	props.moves[move.bestMove] = props.currentPlayer;
 	props = swapPlayerStates(props);
 	props.movesRemaining = remainingMoves(props.moves);
	
 }
 function computeMove(prevState, player) {
 	const possibleMoves = computePossibleMoves(prevState);
 	let nextState = {
 		possibilities: [],
 		bestScore: null,
 		bestMove: null,
 		sumScore: 0
 	}
 	const nextPlayer = swapPlayer(prevState.currentPlayer)
 	possibleMoves.forEach((move) => {
 		prevState.moves[move] = prevState.currentPlayer;
 		const scores = computeScores(prevState);
 		const totalScores = computeTotalScores(scores);
 		const movesRemaining = remainingMoves(prevState.moves);

 		const isGameOver = totalScores === 100 || totalScores === -100;
 		nextState.possibilities.push({
 			weight: prevState.currentPlayer === 'x' ? prevState.bestScore < totalScores :  prevState.bestScore > totalScores,
 			move,
 			scores,
 			totalScores,
 			currentPlayer: nextPlayer,
 			nextMove: movesRemaining && !isGameOver ? computeMove(Object.assign({}, prevState), player) : null
 		});

 		prevState.moves[move] = null;
 	});

 	// ascending
	const sorted = nextState.possibilities.sort((a, b) => {
		return parseInt(a.totalScores, 10) - parseInt(b.totalScores, 10);
	});

	if (prevState.currentPlayer === 'o') {
		// maximize the score
		nextState.bestScore = sorted[0].totalScores;
		nextState.bestMove = sorted[0].move;
		
		let nextMove = sorted[0].nextMove;
		let bestScore = +9999;
		let bestMove = null;
		while (nextMove) {
			if (nextMove.bestScore < bestScore) {
				bestMove = nextMove.move;
			}
			nextMove = nextMove.possibilities[nextMove.move];
		}
		console.log(bestMove)

	} else {
		// minimize the score
		const i = nextState.possibilities.length - 1;
		nextState.bestScore = sorted[i].totalScores;
		nextState.bestMove = sorted[i].move;
		// let nextMove = sorted[i].nextMove;
		// while (nextMove) {
		// 	nextState.bestScore += nextMove.bestScore;
		// 	nextMove = nextMove.possibilities[nextMove.move];
		// }
	}

	if (nextState.possibilities.length) {
		nextState.possibilities.map
	}
	prevState.bestScore += nextState.bestScore;

 	return nextState
 }

 function computePossibleMoves(prevState) {
 	return prevState.moves.map((model, index) => {
 		if (model === 0) return 0;
 		if (!model) return index;
 	}).filter(m => {
 		return m != null && m != undefined;
 	});
 }

 function remainingMoves(moves) {
 	return moves.filter(m => {
 		return !m;
 	}).length;
 }

 function checkRow(prevState, a,b,c) {
 	return (parseCell(prevState.moves[a]) + parseCell(prevState.moves[b]) + parseCell(prevState.moves[c])).trim('');
 }
 function parseCell(v) {
 	return v || "";
 } 

 function checkPoints(rowText) {
 	if (rowText === 'x') {
 		return 0;
 	} else if (rowText === 'xx') {
 		return 0;
 	} else if (rowText === 'xxx') {
 		return 100;
 	} else if (rowText === 'o') {
 		return 0;
 	} else if (rowText === 'oo') {
 		return 0;
 	} else if (rowText === 'ooo') {
 		return -100;
 	} else {
 		return 0;
 	}
 }

 function computeScores(prevState) {
 	const row1 = checkPoints(checkRow(prevState, 0,1,2));
 	const row2 = checkPoints(checkRow(prevState, 3,4,5));
 	const row3 = checkPoints(checkRow(prevState, 6,7,8));

 	const col1 = checkPoints(checkRow(prevState, 0,3,6));
 	const col2 = checkPoints(checkRow(prevState, 1,4,7));
 	const col3 = checkPoints(checkRow(prevState, 2,5,8));

 	const diag1 = checkPoints(checkRow(prevState, 0,4,8));
 	const diag2 = checkPoints(checkRow(prevState, 2,4,6));

 	return [ 
 		row1,
 		row2,
 		row3,
 		col1,
 		col2,
 		col3,
 		diag1,
 		diag2
 	]
 }
function computeTotalScores(arr) {
	return arr.reduce((prev, next) => {
		return prev + next;
	}, 0);
}

 function bestMove() {

 }