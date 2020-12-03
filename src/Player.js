import Cell from "./Cell.js";

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
		
		this._figure = figure;
	}
	
	get figure()
	{
		return this._figure;
	}
}