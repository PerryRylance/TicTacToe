import Cell from "./Cell.js";
import Board from "./Board.js";
import Player from "./Player.js";
import AI from "./AI.js";

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
		
		let human		= this.players[0];
		let computer	= this.players[1];
		
		human.name		= "Player";
		computer.name	= "Computer";
		
		computer.ai		= new AI(this, computer, human);
	}
	
	initElement()
	{
		this.$element	= $("<div class='tic-tac-toe'></div>");
		
		this.$table		= $("<table class='tic-tac-toe'></table>");
		
		for(let y = 0; y < Board.SIZE; y++)
		{
			let $tr = $("<tr></tr>");
			this.$table.append($tr);
			
			for(let x = 0; x < Board.SIZE; x++)
			{
				let $td = $("<td></td>");
				
				$td.attr("data-x", x);
				$td.attr("data-y", y);
				
				this.board.cells[x][y].$element = $td;
				
				$tr.append($td);
			}
		}
		
		this.$element.append(this.$table);
		this.$table.on("click", "td", (event) => this.onCellClicked(event));
		
		this.$reset = $("<button>Reset</button>");
		this.$reset.on("click", (event) => this.onReset(event));
		this.$element.append(this.$reset);
	}
	
	updateElement()
	{
		for(let x = 0; x < Board.SIZE; x++)
			for(let y = 0; y < Board.SIZE; y++)
			{
				let cell	= this.board.cells[x][y];
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
		this.state = Game.STATE_PLAYING;
		
		this.board.reset();
		this.updateElement();
		
		this.currentPlayer = this.players[0];
		this.startTurn();
	}
	
	startTurn()
	{
		this.$table.removeClass("expecting-human-input");
		
		if(this.currentPlayer.ai)
			this.currentPlayer.ai.move();
		else
			this.$table.addClass("expecting-human-input");
	}
	
	endTurn()
	{
		this.updateElement();
		
		if(this.board.isPlayerVictorious(this.currentPlayer))
		{
			this.state = Game.STATE_OVER;
			
			alert(this.currentPlayer.name + " wins");
			
			return;
		}
		else if(this.board.isFull())
		{
			this.state = Game.STATE_OVER;
			
			alert("Tied");
			
			return;
		}
		
		let currentPlayerIndex = this.players.indexOf(this.currentPlayer);
		let nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
		
		this.currentPlayer = this.players[nextPlayerIndex];
		
		this.startTurn();
	}
	
	onCellClicked(event)
	{
		if(this.state == Game.STATE_OVER)
			return;	// NB: Game is over, do nothing
		
		if(this.currentPlayer.ai)
			return;	// NB: Ignore user input during AI turn
		
		let $cell	= $(event.target);
		let x		= $cell.attr("data-x");
		let y		= $cell.attr("data-y");
		
		if(this.board.cells[x][y].state != Cell.STATE_EMPTY)
			return; // NB: Already filled
		
		this.board.cells[x][y].state = this.currentPlayer.figure;
		
		this.endTurn();
	}
	
	onReset(event)
	{
		this.start();
	}
}

Game.STATE_PLAYING			= "playing";
Game.STATE_OVER				= "over;"