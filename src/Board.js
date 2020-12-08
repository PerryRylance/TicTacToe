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
				this.cells[x][y] = new Cell(x, y);
		}
	}
	
	reset()
	{
		for(let x = 0; x < Board.SIZE; x++)
			for(let y = 0; y < Board.SIZE; y++)
				this.cells[x][y].state = Cell.STATE_EMPTY;
	}
	
	clone()
	{
		let result = new Board();
		
		for(let x = 0; x < Board.SIZE; x++)
			for(let y = 0; y < Board.SIZE; y++)
				result.cells[x][y].state = this.cells[x][y].state;
		
		return result;
	}
	
	getEmptyCells()
	{
		let cell;
		let result = [];
		
		for(let x = 0; x < Board.SIZE; x++)
			for(let y = 0; y < Board.SIZE; y++)
			{
				cell = this.cells[x][y];
				
				if(cell.state == Cell.STATE_EMPTY)
					result.push(cell);
			}
		
		return result;
	}
	
	getNumWaysToWin(player)
	{
		let result			= 0;
		let cells			= this.getEmptyCells();
		
		cells.forEach((cell) => {
			
			let prediction	= this.clone();
			prediction.cells[cell.x][cell.y].state = player.figure;
			
			if(prediction.isPlayerVictorious(player))
				result++;
			
		});
		
		return result;
	}
	
	getTwoInARow(player)
	{
		let result		= 0;
		
		for(let x = 0; x < Board.SIZE - 1; x++)
			for(let y = 0; y < Board.SIZE - 1; y++)
			{
				// NB: Don't count diagonals
				if(this.cells[x][y].state == player.figure && (
						this.cells[x + 1][y].state	== player.figure ||
						this.cells[x][y + 1].state	== player.figure ||
						this.cells[x + 1][y + 1].state	== player.figure
					))
					result++;
			}
		
		return result;
	}
	
	isPlayerVictorious(player)
	{
		let winFlag;
		
		// NB: Horizontal wins
		for(let y = 0; y < Board.SIZE; y++)
		{
			winFlag = true;
			
			for(let x = 0; x < Board.SIZE; x++)
			{
				if(this.cells[x][y].state != player.figure)
				{
					winFlag = false;
					break;
				}
			}
			
			if(winFlag)
				return true;
		}
		
		// NB: Vertical wins
		for(let x = 0; x < Board.SIZE; x++)
		{
			winFlag = true;
			
			for(let y = 0; y < Board.SIZE; y++)
			{
				if(this.cells[x][y].state != player.figure)
				{
					winFlag = false;
					break;
				}
			}
			
			if(winFlag)
				return true;
		}
		
		// NB: Diagonal wins
		winFlag = true;
		for(let i = 0; i < Board.SIZE; i++)
		{
			if(this.cells[i][i].state != player.figure)
			{
				winFlag = false;
				break;
			}
		}
		
		if(winFlag)
			return true;
		
		winFlag = true;
		for(let i = 0; i < Board.SIZE; i++)
		{
			if(this.cells[Board.SIZE - 1 - i][i].state != player.figure)
			{
				winFlag = false;
				break;
			}
		}
		
		if(winFlag)
			return true;
		
		return false;
	}
	
	isFull()
	{
		return this.getEmptyCells().length == 0;
	}
	
	log()
	{
		let str = "";
		
		for(let y = 0; y < Board.SIZE; y++)
		{
			for(let x = 0; x < Board.SIZE; x++)
				str += this.cells[x][y].state;
			
			str += "\r\n";
		}
		
		// console.log(str);
	}
}

Board.SIZE		= 3;