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

		state.turns = computeRemainingMoves(state.moves)

		// AI Logic
		// state.player = swapPlayer(state.player);
	

		const output = computeAIMove(state);;

		// const move = output.nextMove;
		// const score = output.nextScore;
		// const player = output.player;
		// const nextMoveWithScores = output.nextMoveWithScores;
		// console.log(`AI ${player} Move: ${ move }, Score: ${ score }`)
		// console.log(output)


		state.player = swapPlayer(state.player);
		state.moves[output.bestMove] = state.player;
		divs[output.bestMove].textContent = state.player;
		state.turns = computeRemainingMoves(state.moves)
		console.log(output)
		// // End turn for AI, Human next

		state.player = computeCurrentPlayer(state.turns);//swapPlayer(state.player);
	}, false);
});


function swapPlayer(current) {
	return current === 'x' ? 'o' : 'x';
}

function computeCurrentPlayer(turns) {
	return turns % 2 === 0 ? 'x' : 'o';
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

function CreateCopy(props) {
	return Promise.resolve(Object.assign({}, props))
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
 	} else if (rowText === 'xx') {
 		return 10 - turns;
 	} else if (rowText === 'oo') {
 		return turns - 10
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

