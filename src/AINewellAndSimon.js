import AI from "./AI.js";

export default class AINewellAndSimon extends AI
{
	constructor(game, player, opponent)
	{
		super(game, player, opponent);
	}
	
	move()
	{
		let best;
		let moves	= this.player.getPossibleMoves(this.game.board, this.opponent);
		
		// console.log("\r\n== AI taking turn", this.game.currentTurn ," ==\r\n");
		
		moves.forEach((move) => {
			
			// console.log("Examining move", move);
			
			if(move.isWinning())
			{
				move.reason = "Found winning move";
				// console.log("Found winning move", move);
				move.priority = 1;
			}
			else if(move.isBlockingVictory())
			{
				move.reason = "Found blocking victory move";
				// console.log("Found blocking victory move", move);
				move.priority = 2;
			}
			else if(move.isForking())
			{
				move.reason = "Found create fork move";
				// console.log("Found create fork move", move);
				move.priority = 3;
			}
			else if(move.isBlockingFork())
			{
				move.reason = "Found move to block fork";
				// console.log("Found move to block fork", move);
				move.priority = 4;
			}
			else if(move.isCenter())
			{
				move.reason = "Found move in center";
				// console.log("Found move in center", move);
				move.priority = 5;
			}
			else if(move.isOppositeCorner())
			{
				move.reason = "Found move in opposite corner";
				// console.log("Found move in opposite corner", move);
				move.priority = 6;
			}
			else if(move.isEmptyCorner())
			{
				move.reason = "Found move in empty corner";
				// console.log("Found move in empty corner", move);
				move.priority = 7;
			}
			else if(move.isEmptySide())
			{
				move.reason = "Found move on empty side";
				// console.log("Found move on empty side", move);
				move.priority = 8;
			}
			else
			{
				move.reason = "Indeterminate outcome for move";
				console.warn("Indeterminate outcome for move", move);
				move.priority = 9;
			}
			
		});
		
		moves.sort(function(a, b) {
			
			if(a.priority == b.priority)
				return 1 - Math.random() * 2;
			
			return (a.priority < b.priority ? -1 : 1);
			
		});
		
		best = moves[0];
		
		// console.log("Found best move", best);
		
		this.game.board.cells[best.x][best.y].state = this.player.figure;
		this.game.endTurn();
	}
}