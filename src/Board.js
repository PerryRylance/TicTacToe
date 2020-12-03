import Cell from "./Cell.js";

/**
 * The Board module handles holding the state of a games current board, it can also be cloned to represent potential future states, so that the AI can use this module to query information from the potential result of a move.
 */
export default class Board
{
	constructor()
	{
		this.cells = [];
		
		for(let x = 0; x < Board.SIZE; x++)
		{
			this.cells[x] = [];
			
			for(let y = 0; y < Board.SIZE; y++)
				this.cells[x][y] = new Cell();
		}
	}
}

Board.SIZE		= 3;