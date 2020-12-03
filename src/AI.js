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
		let best;
		let moves	= this.player.getPossibleMoves(this.game.board, this.opponent);
		
		console.log("\r\n== AI Making move ==\r\n");
		
		moves.forEach((move) => {
			
			console.log("Examining move", move);
			
			if(move.isWinning())
			{
				console.log("Found winning move", move);
				move.priority = 1;
			}
			else if(move.isBlockingVictory())
			{
				console.log("Found blocking victory move", move);
				move.priority = 2;
			}
			else if(move.isForking())
			{
				console.log("Found create fork move", move);
				move.priority = 3;
			}
			else if(move.isBlockingFork(this))
			{
				console.log("Found move to block fork", move);
				move.priority = 4;
			}
			else if(move.isCenter())
			{
				console.log("Found move in center", move);
				move.priority = 5;
			}
			else if(move.isOppositeCorner())
			{
				console.log("Found move in opposite corner", move);
				move.priority = 6;
			}
			else if(move.isEmptyCorner())
			{
				console.log("Found move in empty corner", move);
				move.priority = 7;
			}
			else if(move.isEmptySide())
			{
				console.log("Found move on empty side", move);
				move.priority = 8;
			}
			else
			{
				console.warn("Indeterminate outcome for move", move);
				move.priority = 9;
			}
			
		});
		
		moves.sort(function(a, b) {
			return (a.priority < b.priority ? -1 : 1);
		});
		
		best = moves[0];
		
		console.log("Found best move", best);
		
		this.game.board.cells[best.x][best.y].state = this.player.figure;
		this.game.endTurn();
	}
}