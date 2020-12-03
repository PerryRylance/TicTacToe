import Board from "./Board.js";
import Player from "./Player.js";
import Cell from "./Cell.js";

export default class Move
{
	constructor(board, player, opponent, x, y)
	{
		// NB: Sanity checks
		if(!(board instanceof Board))
			throw new Error("Argument must be a Board");
		
		if(!(player instanceof Player))
			throw new Error("Argument must be a Player");
		
		if(isNaN(x) || x < 0 || x >= Board.SIZE)
			throw new Error("Invalid coordinate");
		
		if(isNaN(y) || y < 0 || y >= Board.SIZE)
			throw new Error("Invalid coordinate");
		
		if(board.cells[x][y].state != Cell.STATE_EMPTY)
			throw new Error("Illegal move");
		
		this.board		= board;
		this.player		= player;
		this.opponent	= opponent;
		this.x			= x;
		this.y			= y;
	}
	
	isWinning()
	{
		let prediction = this.board.clone();
		prediction.cells[this.x][this.y].state = this.player.figure;
		return prediction.isPlayerVictorious(this.player);
	}
	
	isBlockingVictory()
	{
		let prediction = this.board.clone();
		prediction.cells[this.x][this.y].state = this.opponent.figure;
		return prediction.isPlayerVictorious(this.opponent);
	}
	
	isForking()
	{
		let predictedWaysToWin;
		let currentWaysToWin	= this.board.getNumWaysToWin(this.player);
		let prediction			= this.board.clone();
		
		prediction.cells[this.x][this.y].state = this.player.figure;
		
		predictedWaysToWin		= prediction.getNumWaysToWin(this.player);
		
		return predictedWaysToWin == 2 && currentWaysToWin < 2;
	}
	
	isBlockingFork()
	{
		
		
		/*
		- - X
		- 0 -
		X - -
		
		0 - X
		- 0 -
		X - -
		
		In this instance, the AI should not have moved at 0,0
		but rather at 2,2
		*/
		
		let prediction, opponentMove;
		let possibleOpponentForkMoves	= [];
		let possibleOpponentMoves		= this.opponent.getPossibleMoves(this.board, this.opponent);
		
		possibleOpponentMoves.forEach((opponentMove) => {
			
			if(opponentMove.isForking())
				possibleOpponentForkMoves.push(opponentMove);
			
		});
		
		console.log("Opponent has", possibleOpponentForkMoves.length, "possible forks");
		
		// No possible forks to block
		if(possibleOpponentForkMoves.length == 0)
			return false;
		
		// If there is only one possible fork for the opponent, the player should block it.
		if(possibleOpponentForkMoves.length == 1)
		{
			opponentMove = possibleOpponentForkMoves[0];
			
			if(this.x == opponentMove.x && this.y == opponentMove.y)
				return true;
		}
		
		// Otherwise, the player should block all forks in any way that simultaneously allows them to create two in a row.
		let currentTwoInARow = this.board.getTwoInARow(this.player);
		
		possibleOpponentForkMoves.forEach((opponentMove) => {
			
			prediction = this.board.clone();
			prediction.cells[this.x][this.y].state = this.player.figure;
			
			if(prediction.getTwoInARow(this.player) > currentTwoInARow)
				return true;
			
		});
		
		// Otherwise, the player should create a two in a row to force the opponent into defending
		prediction = this.board.clone();
		prediction.cells[this.x][this.y].state = this.player.figure;
		
		console.log(prediction.getTwoInARow(this.player), "predicted two in a rows at ", this.x, this.y, "versus current", currentTwoInARow, "current two in a rows");
		
		if(prediction.getTwoInARow(this.player) > currentTwoInARow)
		{
			return true;
			
			// As long as it doesn't result in them creating a fork.
			possibleOpponentForkMoves = this.opponent.getPossibleMoves(prediction, this.player);
			
			for(let i = 0; i < possibleOpponentForkMoves.length; i++)
			{
				if(opponentMove.isForking())
					return false;
			}
			
			return true;
		}
		
		return false;
	}
	
	isCenter()
	{
		return this.x == 1 && this.y == 1;
	}
	
	isCorner()
	{
		if(this.x == 0 || this.x == Board.SIZE - 1)
			return (this.y == 0 || this.y == Board.SIZE - 1);
		
		if(this.y == 0 || this.y == Board.SIZE - 1)
			return (this.x == 0 || this.x == Board.SIZE - 1);
		
		return false;
	}
	
	isOppositeCorner()
	{
		if(!this.isCorner())
			return false;
		
		let oppositeX	= (this.x == 0 ? Board.SIZE - 1 : 0);
		let oppositeY	= (this.y == 0 ? Board.SIZE - 1 : 0);
		
		if(this.board.cells[oppositeX][oppositeY].state == this.opponent.state)
			return true;
		
		return false;
	}
	
	isEmptyCorner()
	{
		if(
			this.isCorner()
			&&
			this.board.cells[this.x][this.y].state == Cell.STATE_EMPTY
			)
			return true;
		
		return false;
	}
	
	isEmptySide()
	{
		if(
			!this.isCorner()
			&&
			this.board.cells[this.x][this.y].state == Cell.STATE_EMPTY
			)
			return true;
		
		return false;
	}
}