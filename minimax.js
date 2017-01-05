
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
			minimax: computeAIMove(props)
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

function computeMin(props) {
	//console.log('isAITurn');
	// Minimizing player

	const possibleMoves = computePossibleMoves(props.moves);
	const currentBoardScore = computeScores(props);

	let nextMoveWithScores = [];
	possibleMoves.forEach(move => {
		const player = props.player;
		props.moves[move] = player;

		props.turns = computeRemainingMoves(props.moves)
		nextMoveWithScores.push({
			player,
			move,
			score: computeScores(props),
			minimax: computeAIMove(props)
		})
		props.moves[move] = null;
		props.turns = computeRemainingMoves(props.moves)
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


function minimax(state) {

 	const props = Object.assign({}, state);
	props.turns = computeRemainingMoves(props.moves)
	props.player = computeCurrentPlayer(props.turns);
	const isHumanTurn = props.player === 'x';
	const isMaximizing = isHumanTurn;

	props.bestScore = isHumanTurn ? -9999 : +9999;

	const possibleMoves = computePossibleMoves(props.moves);
	const currentScore = computeScores(props);
	

	const possibleMovesWithScores = possibleMoves.map(move => {
		
		props.moves[move] = props.player;
		props.turns = computeRemainingMoves(props.moves)
		props.player = computeCurrentPlayer(props.turns);
		const score = computeScores(props);

		if (isMaximizing) {
			if (score > props.bestScore) {
				props.bestScore = score;
				props.move = move;
			}
		} else {
			if (score < props.bestScore) {
				props.bestScore = score;
				props.move = move;
			}
		}
		//const data = minimax(props).props;
		const data = {
			player: props.player,
			move,
			score,
			minimaxScore: minimax(props).props.bestScore,
			//minimax:  ,
			//minimax: minimax(props).props,
			turns: props.turns
		}
		

		props.moves[move] = null;
		props.turns = computeRemainingMoves(props.moves)
		props.player = computeCurrentPlayer(props.turns);
		return data;
	});

	const m = possibleMovesWithScores.sort((a, b) => {
		return parseInt(a.minimaxScore, 10) - parseInt(b.minimaxScore, 10); 
	})[0];
	const bestMove = m && m.move;
	return {props, possibleMovesWithScores, bestMove};
}


function computeAIMove(props) {
 	// create a copy of the board
 	// Place at the top to escape early
	const hasWinner = computeWinners(props);
	if (hasWinner) return false;



	// Set data for each turn
	return minimax(props);

	// if (isHumanTurn) {
	// 	return computeMax(copy);
	// } else {
	// 	return computeMin(copy);
	// }
 }