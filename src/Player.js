import Cell from "./Cell.js";
import Board from "./Board.js";
import Move from "./Move.js";

export default class Player
{
	constructor(figure)
	{
		switch(figure)
		{
			case Cell.STATE_NAUGHT:
			case Cell.STATE_CROSS:
				break;
			
			default:
				throw new Error("Invalid figure for Player");
				break;
		}
		
		this.figure = figure;
	}
	
	getPossibleMoves(board, opponent)
	{
		if(!(board instanceof Board))
			throw new Error("Not an instance of Board");
		
		if(!(opponent instanceof Player))
			throw new Error("Not an instance of Player");
		
		let result	= [];
		let cells	= board.getEmptyCells();
		
		cells.forEach((cell) => {
			result.push(new Move(board, this, opponent, cell.x, cell.y));
		});
		
		return result;
	}
}