var Apple, Snake, Score;



function startGame() {																						//INIZIALIZZO il gioco
	Apple = new Apple(19, "red");																			//Apple(dimensione, colore)
	Apple.newPos();
	Snake = new Snake(19, "green", 3);																		//Snake(dimensione, colore, lunghezza iniziale)
	Snake.init();
	Score = new Score(3);																					//Score(punteggio-massimo)
    GameArea.start();																						//Avvio il gioco							
}

//Genero area di gioco
var GameArea = {
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
	ctx = GameArea.context;
	ctx.beginPath();																						//INIZIO FORMA
	ctx.rect(x*width, y*width, width, width);																//Stampo il rettangolo moltiplicando posizione per dimensione rettangolo
	ctx.fillStyle = color;																					//Colore riempimento
	ctx.fill();
	ctx.strokeStyle = "black";																				//Colore Contorno
	ctx.stroke();	
	ctx.closePath();																						//FINE FORMA
}

//Snake
function Snake(width, color, initLength){
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
	this.update = function() {																				//Stampo lo Snake
		for(i = 0; i < this.body.length; i++){
			printSquare(this.body[i].x, this.body[i].y, width, this.color);
		}
	}
	this.move = function(){																					//Movimento dello Snake
		var SnakeX = this.body[0].x;																		//Variabili temporanee di posizione
		var SnakeY = this.body[0].y;

		var tail = this.body.pop(); 																		//Rimuovo tramite pop l'ultima cella

		SnakeX += this.direction.x;																			//Sposto in base alla direzione
		SnakeY += this.direction.y;

		eatApple(SnakeX, SnakeY);																		//Controllo se la mela è mangiata

		//Eseguo controllo (uscita dall'area consentita o collisione con il corpo)
		if(SnakeX == GameArea.canvas.width/(Snake.width+1)+1 || SnakeX == -1 || SnakeY == GameArea.canvas.height/(Snake.width+1)+1 || SnakeY == -1 ){
			over = true;		
			message("GAME OVER")	;																		//GAME OVER
		}else{
			tail.x = SnakeX; 																				//Ok, setto la nuova posizione
			tail.y = SnakeY;
		}
		this.body.unshift(tail);																			//Inserisco la nuova posizione
	}
}

//Gestisco bottoni
function sposta(direzione){
	switch(direzione){
		case "right":																						//RIGHT
			if(Snake.direction.x != -1){
				Snake.direction.x = 1;
				Snake.direction.y = 0;
			}
			break;
		case "left":																						//LEFT
			if(Snake.direction.x != 1){
				Snake.direction.x = -1;
				Snake.direction.y = 0;
			}
			break;
		case "down":																						//DOWN
			if(Snake.direction.y != -1){
				Snake.direction.x = 0;
				Snake.direction.y = 1;
			}
			break;
		case "up":																							//UP
			if(Snake.direction.y != 1){
				Snake.direction.x = 0;
				Snake.direction.y = -1;
			}
			break;
	}
}

//Mela
function Apple(width, color) {
	//impostazioni varie
    this.width = width;
	this.color = color;
    this.x;
    this.y;    
    this.update = function() {																				//Stampo la mela
		printSquare(this.x, this.y, width, this.color);
	}
    this.newPos = function() {																				//Cambio posizione
		this.x = Math.floor(Math.random()*(GameArea.canvas.width/(width+1)));
		this.y = Math.floor(Math.random()*(GameArea.canvas.width/(width+1)));     
	}    
}

//Controllo se la mela e' stata mangiata
function eatApple(x, y){
	if(x == Apple.x && y == Apple.y){																		//Mangiata
		Score.add();																						//Aumento punteggio
		Apple.newPos();																						//Genero nuova mela
		var copia = {x: Snake.body[Snake.body.length-1].x, y: Snake.body[Snake.body.length-1].y};			//Copio la coda
		copia.x-= Snake.direction.x;																		//Creo la nuova coda
		copia.y-= Snake.direction.y;
		Snake.body.push(copia);																				//Aggiungo la nuova Coda
	}
}

//Game over
function message(testo){
	clearInterval(GameArea.interval);																		//Blocco aggiornamento frame
	GameArea.clear();																						//Pulisco schermo
	var fontSize = "30";
	ctx.fillStyle = 'blue';
	ctx.font= fontSize +"px " + "Georgia";
	var textWidth = ctx.measureText(testo).width;  															//Ottengo la lunghezza del testo per la stampa
	ctx.fillText(testo, (GameArea.canvas.width/2)-(textWidth/2), (GameArea.canvas.height/2)+(fontSize/2));	//Stampo
}

//Gestione punteggio
function Score(max) {
	this.points = 0;
	this.max = max;
	this.add = function() {																					//Aumento il punteggio
		this.points++;
		if(this.points == this.max)	
			message("VITTORIA");
	}
	this.print = function(){																				//Stampo il punteggio
		ctx.fillStyle = 'blue';
		ctx.font="15px Georgia";   
		ctx.fillText("Score: " + this.points, 10, 10);
	}
}

//Disegno tutto
function updateGameArea() {
	GameArea.clear();

	Snake.move();																						//Faccio muovere lo Snake																					//Pulisco schermo
	Apple.update();																						//Stampo mela
	Snake.update();																						//Stampo Snake
	Score.print();																						//Stampo punteggio
}
