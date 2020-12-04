import Cell from "./Cell.js";
import Board from "./Board.js";
import Player from "./Player.js";
import AINewellAndSimon from "./AINewellAndSimon.js";
import AIMinimax from "./AIMinimax.js";

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
		let option;
		
		this.players = [
			new Player(Cell.STATE_CROSS),
			new Player(Cell.STATE_NAUGHT)
		];
		
		option = $("select[name='player-1'] option:selected");
		this.players[0].name	= option.text();
		this.players[0].ai		= this.getAIFromOptionValue(option.val(), this.players[0], this.players[1]);
		
		option = $("select[name='player-2'] option:selected");
		this.players[1].name	= option.text();
		this.players[1].ai		= this.getAIFromOptionValue(option.val(), this.players[1], this.players[0]);
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
		
		this.$status = $("<div class='status'></div>");
		this.$element.append(this.$status);
		
		this.$reset = $("<button>Reset</button>");
		this.$reset.on("click", (event) => this.onReset(event));
		this.$element.append(this.$reset);
		
		this.$play = $("button.play");
		this.$play.on("click", (event) => this.onPlay(event));
		
		this.$delay = $("input[name='delay']");
		
		$("#advanced-settings").hide();
		$("#toggle-advanced-settings").on("click", (event) => {
			$("#advanced-settings").show();
		});
		
		this.status("Ready");
	}
	
	getAIFromOptionValue(value, player, opponent)
	{
		switch(value)
		{
			case "ai-newell-and-simon":
				return new AINewellAndSimon(this, player, opponent);
				break;
			
			case "ai-minimax":
				return new AIMinimax(this, player, opponent);
				break;
			
			default:
				break;
		}
	}
	
	updateElement()
	{
		let $span;
		let delay = this.$delay.val();
		
		for(let x = 0; x < Board.SIZE; x++)
			for(let y = 0; y < Board.SIZE; y++)
			{
				let cell	= this.board.cells[x][y];
				let $td		= cell.$element;
				
				if($td.attr("data-state") == cell.state)
					continue;
				
				$td.attr("data-state", cell.state);
				
				switch(cell.state)
				{
					case Cell.STATE_NAUGHT:
					
						$span = $("<span>&#9675;</span>");
						
						if(delay > 100)
							$span.addClass("animate__bounceIn");
							
						$td.html($span);
						
						break;
					
					case Cell.STATE_CROSS:
					
						$span = $("<span>&#215;</span>");
					
						if(delay > 100)
							$span.addClass("animate__bounceIn");
					
						$td.html($span);
						
						break;
					
					default:
						$td.html("");
						break;
				}
			}
	}
	
	start()
	{
		this.benchmarkGameCount++;
		
		this.state = Game.STATE_PLAYING;
		this.status("Game on!");
		
		this.board.reset();
		this.updateElement();
		
		this.currentPlayer = this.players[0];
		this.startTurn();
	}
	
	startTurn()
	{
		let delay = this.$delay.val();
		
		this.$table.removeClass("expecting-human-input");
		
		if(this.currentPlayer.ai)
		{
			if(delay == 0)
				this.currentPlayer.ai.move();
			else
				setTimeout(() => {
					this.currentPlayer.ai.move();
				}, delay);
		}
		else
			this.$table.addClass("expecting-human-input");
	}
	
	endTurn()
	{
		this.updateElement();
		
		if(this.board.isPlayerVictorious(this.currentPlayer))
		{
			this.status(this.currentPlayer.name + " wins");
			this.endGame();
			
			return;
		}
		else if(this.board.isFull())
		{
			this.status("Tied");
			this.endGame();
			
			return;
		}
		
		let currentPlayerIndex = this.players.indexOf(this.currentPlayer);
		let nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
		
		this.currentPlayer = this.players[nextPlayerIndex];
		
		this.startTurn();
	}
	
	endGame()
	{
		this.state = Game.STATE_OVER;
		
		if($("input[name='benchmark']").prop("checked"))
			setTimeout(() => {
				this.start();
			}, 0);
	}
	
	status(message)
	{
		if($("input[name='benchmark']").prop("checked"))
		{
			let now				= new Date();
			let delta			= now.getTime() - this.benchmarkStartTime;
			let seconds			= delta / 1000;
			let gamesPerSecond	= this.benchmarkGameCount / seconds;
			
			this.$status.html(Math.round(gamesPerSecond) + " games per second");
			
			return;
		}
		
		this.$status.html(message);
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
	
	onPlay(event)
	{
		if($("input[name='benchmark']").prop("checked"))
		{
			this.benchmarkStartTime		= new Date().getTime();
			this.benchmarkGameCount		= 0;
		}
		
		this.initPlayers();
		this.start();
	}
}

Game.STATE_PLAYING			= "playing";
Game.STATE_OVER				= "over;"