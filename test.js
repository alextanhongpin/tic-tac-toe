'use strict';



const HUMAN = 'x';
const AI = 'o';

const state = {
	moves: Array(9).fill(null),
	scores: Array(8).fill(0),
	player: "x",
	turns: 9,
	bestScore: +9999
}

const divs = [...document.querySelectorAll('#tictactoe div')];


divs.map((div, index) => {
	div.addEventListener('click', (evt) => {
		const text = evt.currentTarget.textContent;
		if (text) return false;
		state.moves[index] = state.player;
		evt.currentTarget.textContent = state.player;
		console.log('HUMAN move', index)

		state.turns = computeRemainingMoves(state.moves)

		// AI Logic
		// state.player = swapPlayer(state.player);
		const mm = minimax(state);
		const type = mm.type;

		const output = mm.results;
		const move = output.nextMove;
		const score = output.nextScore;
		const player = output.player;
		const nextMoveWithScores = output.nextMoveWithScores;
		console.log(`AI ${player} Move: ${ move }, Score: ${ score }`)
		console.log(output)


		state.player = swapPlayer(state.player);
		state.moves[move] = state.player;
		divs[move].textContent = state.player;
		state.turns = computeRemainingMoves(state.moves)
		// // End turn for AI, Human next

		state.player = swapPlayer(state.player);
	}, false);
});


function swapPlayer(current) {
	return current === 'x' ? 'o' : 'x';
}


function computeMax(props) {
	// Maximizing player

	const moves = computePossibleMoves(props.moves);
	const currentBoardScore = computeScores(props);
	//console.log('isHumanTurn:currentBoardScore', currentBoardScore);

	let nextMoveWithScores = [];
	moves.map(move => {
		const player = props.player;
		props.moves[move] = player;
		nextMoveWithScores.push({
			player,
			move,
			score: computeScores(props),
			minimax: minimax(props)
		})
		props.moves[move] = null;
	});

	let nextScore = -9999;
	let nextMove = null;

	const output = computeScoreForEachMove(nextScore, nextMove, nextMoveWithScores);
	nextScore = output.nextScore;
	nextMove = output.nextMove;

	const scores = output.moves.sort((a, b) => {
		return parseInt(a.score, 10) - parseInt(b.score, 10);
	});
	nextMove = scores[0].move;
	nextScore = scores[0].score;
		//nextMoveWithScores = null;
	return { nextScore, nextMove, nextMoveWithScores, moves: output.moves, player:props.player }
}

function computeScoreForEachMove(nextScore, nextMove, moves) {
	moves.map((move) => {
		
		const isHuman = move.player === 'x';

		if (isHuman) {
			//nextScore = -9999;
			if (move.score >= nextScore) {
				nextScore = move.score;
				nextMove = move.move;
			}

		} else {
			//nextScore = +9999;
			if (move.score <= nextScore) {
				nextScore = move.score;
				nextMove = move.move;
			}
		}
		
		if (move.minimax) {
			const results = computeScoreForEachMove(nextScore, nextMove, move.minimax.results.nextMoveWithScores);
			if (isHuman) { 
				if (results.nextScore >= nextScore) {
					nextScore = results.nextScore;
					nextMove = results.nextMove;
				}
			} else {

				if (results.nextScore <= nextScore) {
					nextScore = results.nextScore;
					nextMove = results.nextMove;
				}
			}
		}
		return move;
	});

	return {
		nextScore,
		nextMove,
		moves
	}
}

function computeMin(props) {
	//console.log('isAITurn');
	// Minimizing player

	const moves = computePossibleMoves(props.moves);
	const currentBoardScore = computeScores(props);

	let nextMoveWithScores = [];
	moves.map(move => {
		const player = props.player;
		props.moves[move] = player;
		nextMoveWithScores.push({
			player,
			move,
			score: computeScores(props),
			minimax: minimax(props)
		})
		props.moves[move] = null;
	});

	let nextScore = +9999;
	let nextMove = null;
	// nextMoveWithScores.map((move) => {

	// 	if (move.score <= nextScore) {
	// 		nextScore = move.score;
	// 		nextMove = move.move;
	// 	}
	// });
	const output = computeScoreForEachMove(nextScore, nextMove, nextMoveWithScores);
	nextScore = output.nextScore;
	nextMove = output.nextMove;

	const scores = output.moves.sort((a, b) => {
		return parseInt(b.score, 10) - parseInt(a.score, 10);
	});
	nextMove = scores[0].move;
	nextScore = scores[0].score;

	return { nextScore, nextMove, nextMoveWithScores, moves: output.moves, player:props.player }
}

function CreateCopy(props) {
	return Promise.resolve(Object.assign({}, props))
}

 function minimax(props) {
 	// create a copy of the board
 	const copy = Object.assign({}, props);

 	// Place at the top to escape early
	const hasWinner = computeWinners(props);
	if (hasWinner) return false;

	copy.player = swapPlayer(copy.player);
	const isHumanTurn = copy.player === 'x';

	let results = null;
	let type = '';
	if (isHumanTurn) {
		results = computeMin(copy);
		type = 'computeMax';
	} else {
		results = computeMax(copy);
		type = 'computeMin';
	}

	return {results, type};
 }

function computePossibleMoves(moves) {
	return moves.map((model, index) => {
		if (model === 0) return 0;
		if (!model) return index;
	}).filter(m => {
		return m != null && m != undefined;
	});
}


 function computeRemainingMoves(moves) {
 	return moves.filter(m => {
 		return m != null || m != undefined;
 	}).length;
 }

 function checkRow(prevState, a,b,c) {
 	return (parseCell(prevState.moves[a]) + parseCell(prevState.moves[b]) + parseCell(prevState.moves[c])).trim('');
 }
 function parseCell(value) {
 	return value || "";
 } 

 function computeScore(turns, rowText) {

 	if (rowText === 'xxx') {
 		return 100 - turns;
 	} else if (rowText === 'ooo') {
 		return turns - 100;
 	} else {
 		return 0;
 	}
 }
 function computeWinner(turns, rowText) {
 	 if (rowText === 'xxx') {
 		return 'x win';
 	} else if (rowText === 'ooo') {
 		return 'o win';
 	} else {
 		return null;
 	}
 }
 function computeWinners(prevState) {
 	const row1 = computeWinner(prevState.turns, checkRow(prevState, 0,1,2));
 	const row2 = computeWinner(prevState.turns, checkRow(prevState, 3,4,5));
 	const row3 = computeWinner(prevState.turns, checkRow(prevState, 6,7,8));

 	const col1 = computeWinner(prevState.turns, checkRow(prevState, 0,3,6));
 	const col2 = computeWinner(prevState.turns, checkRow(prevState, 1,4,7));
 	const col3 = computeWinner(prevState.turns, checkRow(prevState, 2,5,8));

 	const diag1 = computeWinner(prevState.turns, checkRow(prevState, 0,4,8));
 	const diag2 = computeWinner(prevState.turns, checkRow(prevState, 2,4,6));

 	return [ 
 		row1,
 		row2,
 		row3,
 		col1,
 		col2,
 		col3,
 		diag1,
 		diag2
 	].some(m => {
 		return m != null;
 	});
 }


 function computeScores(prevState) {
 	const row1 = computeScore(prevState.turns, checkRow(prevState, 0,1,2));
 	const row2 = computeScore(prevState.turns, checkRow(prevState, 3,4,5));
 	const row3 = computeScore(prevState.turns, checkRow(prevState, 6,7,8));

 	const col1 = computeScore(prevState.turns, checkRow(prevState, 0,3,6));
 	const col2 = computeScore(prevState.turns, checkRow(prevState, 1,4,7));
 	const col3 = computeScore(prevState.turns, checkRow(prevState, 2,5,8));

 	const diag1 = computeScore(prevState.turns, checkRow(prevState, 0,4,8));
 	const diag2 = computeScore(prevState.turns, checkRow(prevState, 2,4,6));

 	return computeTotalScores([ 
 		row1,
 		row2,
 		row3,
 		col1,
 		col2,
 		col3,
 		diag1,
 		diag2
 	]);
 }

 // Returns the total score from an array of scores
function computeTotalScores(scores) {
	return scores.reduce((prev, next) => {
		return prev + next;
	}, 0);
}

