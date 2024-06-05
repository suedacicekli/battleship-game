var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships:[
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess); // przesukuje tablice w celu znalezienia guess i zwraca indeks
		  if (ship.hits[index] === "hit") {
				view.displayMessage("You hit this ship before.");
				return true;
			} else if (index >= 0) {
					ship.hits[index] = "hit";
					view.displayHit(guess);
					view.displayMessage("It's a hit!");
					if (this.isSunk(ship)) {
						view.displayMessage("You sunk my battleship!");
						this.shipsSunk++;
					}
					return true;
				}
		}
		view.displayMiss(guess);
		view.displayMessage("It's a miss!");
		return false;
	},

	isSunk: function(ship) {
		for (i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
				this.ships[i].locations = locations;
		}
				console.log("Tablica okrętów: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) {  //rozmieszczamy w poziomie
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else { //rozmieszczmay w pionie
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};

var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class","ship");

	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class","miss");
	}
};

var controller = {
    guesses: 0,
    processGuess: function(location) {
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sunk all of my battleships in " + this.guesses + " tries.");
                document.getElementById("guessInput").disabled = true;
            }
        }
    }
}

function submitGuess() {
    var userInput = document.getElementById("guessInput").value.toUpperCase(); // Kullanıcının girdiği tahmini al, büyük harflere dönüştür
    if (userInput.length === 2 && /[A-G][0-6]/.test(userInput)) { // Tahminin geçerli olup olmadığını kontrol et
        var row = userInput.charCodeAt(0) - 65; // Karakterin ASCII değerini alarak satırı belirle
        var col = parseInt(userInput.charAt(1)); // Sütunu al
        var location = row + '' + col; // Tahmini oluştur
        controller.processGuess(location); // Tahmini işle
    } else {
        alert("Please enter a valid guess (e.g., A5)."); // Geçersiz tahmin uyarısı göster
    }
}


window.onload = init;

function init() {

	var guessClick = document.getElementsByTagName("td");
		for (var i = 0; i < guessClick.length; i++) {
			guessClick[i].onclick = answer;
		}

	model.generateShipLocations();
	view.displayMessage("Hello, let's play! There are 3 ships, each 3 cells long");
}

function answer(eventObj) {
	var shot = eventObj.target;
	var location = shot.id;
	controller.processGuess(location);
}




