import Player from "./Player.js";
import Board from "./Board.js";
import Cell from "./Cell.js";
import Move from "./Move.js";

export default class AI
{
	constructor(game, player, opponent)
	{
		if(!(player instanceof Player))
			throw new Error("Not a valid Player");
			
		if(!(opponent instanceof Player))
			throw new Error("Not a valid Player");
		
		this.game		= game;
		this.player		= player;
		this.opponent	= opponent;
	}
	
	move()
	{
		let moves	= this.getPossibleMoves();
		
		moves.forEach((move) => {
			
			if(move.isWinning())
				console.log("Found winning move", move);
			else if(move.isBlockingVictory())
				console.log("Found blocking victory move", move);
			else if(moive.)
			else
				throw new Error("Invalid state");
			
		});
	}
	
	getPossibleMoves()
	{
		let result	= [];
		let cells	= this.game.board.getEmptyCells();
		
		cells.forEach((cell) => {
			result.push(new Move(this.game.board, this.player, this.opponent, cell.x, cell.y));
		});
		
		return result;
	}
	
	/*getNonBlockedLineCount(board)
	{
		
	}*/
}