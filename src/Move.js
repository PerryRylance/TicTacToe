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
		
		// console.log("Predicted that player", this.player.name, "would have", predictedWaysToWin, "ways to win after moving at", this.x, this.y);
		
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
		
		// console.log(this.opponent.name + " currently has", possibleOpponentForkMoves.length, "possible forks");
		
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
		
		// console.log("Opponent" + this.opponent.name + " has possible forks moves", possibleOpponentForkMoves);
		
		// Otherwise, the player should block all forks in any way that simultaneously allows them to create two in a row.
		let currentTwoInARow	= this.board.getTwoInARow(this.player);
		let currentWaysToWin	= this.board.getNumWaysToWin(this.player);
		
		let blockAndCreateTwoInARow = false;
		let blockAndCreateWaysToWin = false;
		
		// console.log(this.player.name + " currently has " + currentTwoInARow + " two in a row");
		
		possibleOpponentForkMoves.forEach((opponentMove) => {
			
			if(this.x != opponentMove.x || this.y != opponentMove.y)
				return true; // NB: Keep iterating
			
			prediction = this.board.clone();
			prediction.cells[this.x][this.y].state = this.player.figure;
			
			// console.log("Move at", this.x, this.y, "would result in " + this.opponent.name, prediction.getNumWaysToWin(this.opponent), " having ways to win (aka forks?)");
			
			// console.log("Move at", this.x, this.y, "would give " + this.player.name, prediction.getTwoInARow(this.player), " two in a row");
			
			if(prediction.getTwoInARow(this.player) > currentTwoInARow &&
				prediction.getNumWaysToWin(this.opponent) < this.board.getNumWaysToWin(this.opponent))
			{
				blockAndCreateTwoInARow = true;
				return false; // NB: Break out of iteration
			}
			
			/*prediction = this.board.clone();
			prediction.cells[opponentMove.x][opponentMove.y].state = this.player.figure;
			
			prediction.log();
			
			// console.log("Move at", opponentMove.x, opponentMove.y, "would result in " + this.opponent.name, prediction.getNumWaysToWin(this.opponent), " having ways to win");
			
			// console.log("Move at", opponentMove.x, opponentMove.y, "would give " + this.player.name, prediction.getTwoInARow(this.player), " two in a row");
			
			// NB: Need to test if opponent now has less forks (eg if this actually blocks forks)
			
			if(prediction.getTwoInARow(this.player) > currentTwoInARow && this.x == opponentMove.x && this.y == opponentMove.y)
			{
				blockAndCreateTwoInARow = true;
				return false; // NB: Halt iteration
			}
			
			// console.log("Move at", this.x, this.y, "would give " + this.player.name, prediction.getNumWaysToWin(this.player), " ways to win");
			
			if(prediction.getNumWaysToWin(this.player) > currentWaysToWin)
			{
				blockAndCreateWaysToWin = true;
				return false; // NB: Halt iteration
			}*/
			
			/*
			// TODO: isForking repeated here. Please refactor
			let predictedWaysToWin;
			let currentWaysToWin	= this.board.getNumWaysToWin(this.player);
			
			predictedWaysToWin		= prediction.getNumWaysToWin(this.player);
			
			// console.log("Predicted that player", this.player.name, "would have", predictedWaysToWin, "ways to win after moving at", this.x, this.y);
			
			return predictedWaysToWin == 2 && currentWaysToWin < 2;*/
			
		});
		
		if(blockAndCreateTwoInARow)
			// console.log("Move at ", this.x, this.y, "would give", this.player.name, " two in a row, and blocks a fork");
			
		if(blockAndCreateTwoInARow)
			// console.log("Move at ", this.x, this.y, "would give", this.player.name, " two in a row, and blocks a fork");
		
		if(blockAndCreateWaysToWin || blockAndCreateTwoInARow)
			return true;
		
		// Otherwise, the player should create a two in a row to force the opponent into defending
		prediction = this.board.clone();
		prediction.cells[this.x][this.y].state = this.player.figure;
		
		prediction.log();
		
		// console.log(prediction.getTwoInARow(this.player), "predicted two in a rows at ", this.x, this.y, "versus current", currentTwoInARow, "current two in a rows");
		
		if(prediction.getTwoInARow(this.player) > currentTwoInARow)
		{
			// As long as it doesn't result in them creating a fork.
			possibleOpponentForkMoves = this.opponent.getPossibleMoves(prediction, this.player);
			
			for(let i = 0; i < possibleOpponentForkMoves.length; i++)
			{
				opponentMove = possibleOpponentForkMoves[i];
				
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
		
		if(this.board.cells[oppositeX][oppositeY].state == this.opponent.figure)
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