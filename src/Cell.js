/**
 * This class represents a single cell on the board
 */
export default class Cell
{
	constructor(x, y)
	{
		this.state		= Cell.STATE_EMPTY;
		this.x			= x;
		this.y			= y;
	}
}

Cell.STATE_EMPTY		= "-";
Cell.STATE_NAUGHT		= "o";
Cell.STATE_CROSS		= "x";