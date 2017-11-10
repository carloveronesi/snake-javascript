var apple, snake, score;

function startGame() {																						//INIZIALIZZO il gioco
	apple = new apple(19, "red");																			//apple(dimensione, colore)
	apple.newPos();
	snake = new snake(19, "green", 3);																		//snake(dimensione, colore, lunghezza iniziale)
	snake.init();
	score = new score(3);																					//Score(punteggio-massimo)
    gameArea.start();																						//Avvio il gioco							
}

//Genero area di gioco
var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
        this.canvas.width = 360;																			//Setto lunghezza area gioco
		this.canvas.height = 360;																			//Setto altezza area gioco
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);								//Inserisco prima dei comandi
		
        this.interval = setInterval(updateGameArea, 200);													//Setto intervallo aggiornamento (in ms)
	},
	clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);								//Pulisco
    }
}

//Stampo quadrato
function printSquare(x, y, width, color) {
	ctx = gameArea.context;
	ctx.beginPath();																						//INIZIO FORMA
	ctx.rect(x*width, y*width, width, width);																//Stampo il rettangolo moltiplicando posizione per dimensione rettangolo
	ctx.fillStyle = color;																					//Colore riempimento
	ctx.fill();
	ctx.strokeStyle = "black";																				//Colore Contorno
	ctx.stroke();	
	ctx.closePath();																						//FINE FORMA
}

//Snake
function snake(width, color, initLength){
	//Settaggi vari
	this.width = width;
	this.color = color;
	this.initLength = initLength;
	this.body = [];																							//Vettore contenente le posizioni dei rettangoli
	this.direction = {x: 1, y:0};																			//Setto la direzione iniziale


	this.init = function(){																					//Inizializzo il vettore posizionando in alto a sx
		for(i = this.initLength-1; i >= 0; i--){
			this.body.push({x:i, y:0});																		//Inserisco tramite push
		}
	}
	this.update = function() {																				//Stampo lo snake
		for(i = 0; i < this.body.length; i++){
			printSquare(this.body[i].x, this.body[i].y, width, this.color);
		}
	}
	this.move = function(){																					//Movimento dello snake
		var snakeX = this.body[0].x;																		//Variabili temporanee di posizione
		var snakeY = this.body[0].y;

		var tail = this.body.pop(); 																		//Rimuovo tramite pop l'ultima cella

		snakeX += this.direction.x;																			//Sposto in base alla direzione
		snakeY += this.direction.y;

		melaMangiata(snakeX, snakeY);																		//Controllo se la mela è mangiata

		//Eseguo controllo (uscita dall'area consentita o collisione con il corpo)
		if(snakeX == gameArea.canvas.width/(snake.width+1)+1 || snakeX == -1 || snakeY == gameArea.canvas.height/(snake.width+1)+1 || snakeY == -1 ){
			over = true;		
			messaggio("GAME OVER")	;																		//GAME OVER
		}else{
			tail.x = snakeX; 																				//Ok, setto la nuova posizione
			tail.y = snakeY;
		}
		this.body.unshift(tail);																			//Inserisco la nuova posizione
	}
}

//Gestisco bottoni
function sposta(direzione){
	switch(direzione){
		case "right":																						//RIGHT
			if(snake.direction.x != -1){
				snake.direction.x = 1;
				snake.direction.y = 0;
			}
			break;
		case "left":																						//LEFT
			if(snake.direction.x != 1){
				snake.direction.x = -1;
				snake.direction.y = 0;
			}
			break;
		case "down":																						//DOWN
			if(snake.direction.y != -1){
				snake.direction.x = 0;
				snake.direction.y = 1;
			}
			break;
		case "up":																							//UP
			if(snake.direction.y != 1){
				snake.direction.x = 0;
				snake.direction.y = -1;
			}
			break;
	}
}

//Mela
function apple(width, color) {
	//impostazioni varie
    this.width = width;
	this.color = color;
    this.x;
    this.y;    
    this.update = function() {																				//Stampo la mela
		printSquare(this.x, this.y, width, this.color);
	}
    this.newPos = function() {																				//Cambio posizione
		this.x = Math.floor(Math.random()*(gameArea.canvas.width/(width+1)));
		this.y = Math.floor(Math.random()*(gameArea.canvas.width/(width+1)));     
	}    
}

//Controllo se la mela e' stata mangiata
function melaMangiata(x, y){
	if(x == apple.x && y == apple.y){																		//Mangiata
		score.add();																						//Aumento punteggio
		apple.newPos();																						//Genero nuova mela
		var copia = {x: snake.body[snake.body.length-1].x, y: snake.body[snake.body.length-1].y};			//Copio la coda
		copia.x-= snake.direction.x;																		//Creo la nuova coda
		copia.y-= snake.direction.y;
		snake.body.push(copia);																				//Aggiungo la nuova Coda
	}
}

//Game over
function messaggio(testo){
	clearInterval(gameArea.interval);																		//Blocco aggiornamento frame
	gameArea.clear();																						//Pulisco schermo
	var fontSize = "30";
	ctx.fillStyle = 'blue';
	ctx.font= fontSize +"px " + "Georgia";
	var textWidth = ctx.measureText(testo).width;  															//Ottengo la lunghezza del testo per la stampa
	ctx.fillText(testo, (gameArea.canvas.width/2)-(textWidth/2), (gameArea.canvas.height/2)+(fontSize/2));	//Stampo
}

//Gestione punteggio
function score(max) {
	this.points = 0;
	this.max = max;
	this.add = function() {																					//Aumento il punteggio
		this.points++;
		if(this.points == this.max)	
			messaggio("VITTORIA");
	}
	this.print = function(){																				//Stampo il punteggio
		ctx.fillStyle = 'blue';
		ctx.font="15px Georgia";   
		ctx.fillText("score: " + this.points, 10, 10);
	}
}

//Disegno tutto
function updateGameArea() {
	gameArea.clear();

	snake.move();																						//Faccio muovere lo snake																					//Pulisco schermo
	apple.update();																						//Stampo mela
	snake.update();																						//Stampo snake
	score.print();																						//Stampo punteggio
}
