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
		prediction.cells[this.x][this.y] = this.player.figure;
		return prediction.isPlayerVictorious(this.player);
	}
	
	isBlockingVictory()
	{
		let prediction = this.board.clone();
		prediction.cells[this.x][this.y] = this.opponent.figure;
		return prediction.isPlayerVictorious(this.opponent);
	}
	
	isForking()
	{
		
	}
	
	isBlockingFork()
	{
		
	}
	
	isCenter()
	{
		return this.x == 1 && this.y == 1;
	}
	
	isOppositeCorner()
	{
		
	}
	
	isEmptyCorner()
	{
		
	}
	
	isEmptySide()
	{
		
	}
}