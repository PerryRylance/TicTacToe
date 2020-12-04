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
}