import Cell from "./Cell.js";
import Board from "./Board.js";
import Player from "./Player.js";

/**
 * The Game module handles representing the board state, player turn logic, and game state.
 */
export default class Game
{
	constructor()
	{
		this.board = new Board();
		
		this.initPlayers();
		this.initElement();
		
		this.start();
	}
	
	initPlayers()
	{
		this.players = [
			new Player(Cell.STATE_CROSS),
			new Player(Cell.STATE_NAUGHT)
		];
	}
	
	initElement()
	{
		this.$element = $("<table class='tic-tac-toe'></table>");
		
		for(let y = 0; y < Board.SIZE; y++)
		{
			let $tr = $("<tr></tr>");
			this.$element.append($tr);
			
			for(let x = 0; x < Board.SIZE; x++)
			{
				let $td = $("<td></td>");
				
				$td.attr("data-x", x);
				$td.attr("data-y", y);
				
				this.board.cells[x][y].$element = $td;
				
				$tr.append($td);
			}
		}
		
		this.$element.on("click", "td", (event) => this.onCellClicked(event));
	}
	
	updateElement()
	{
		for(let x = 0; x < Board.SIZE; x++)
			for(let y = 0; y < Board.SIZE; y++)
			{
				let cell	= this.board.cells[x][y]
				let $td		= cell.$element;
				
				$td.attr("data-state", cell.state);
				
				switch(cell.state)
				{
					case Cell.STATE_NAUGHT:
						$td.html("&#9675;");
						break;
					
					case Cell.STATE_CROSS:
						$td.html("&#215;");
						break;
					
					default:
						$td.html("");
						break;
				}
			}
	}
	
	start()
	{
		this.currentPlayer = this.players[0];
		this.startTurn();
	}
	
	startTurn()
	{
		this.$element.removeClass("expecting-human-input");
		
		if(this.currentPlayer.ai)
			this.currentPlayer.ai.move();
		else
			this.$element.addClass("expecting-human-input");
	}
	
	endTurn()
	{
		let currentPlayerIndex = this.players.indexOf(this.currentPlayer);
		
		let nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
		
		this.currentPlayer = this.players[nextPlayerIndex];
		
		this.startTurn();
	}
	
	onCellClicked(event)
	{
		if(this.currentPlayer.ai)
			return;	// NB: Ignore user input during AI turn
		
		let $cell	= $(event.target);
		let x		= $cell.attr("data-x");
		let y		= $cell.attr("data-y");
		
		this.board.cells[x][y].state = this.currentPlayer.figure;
		
		this.updateElement();
		
		this.endTurn();
	}
}