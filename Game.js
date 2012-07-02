var Game = function () {
	this.players = {};
	this.gameState = {};
	return this;
}

Game.prototype.addPlayer = function (name) {
	console.log("added player");
	if (this.players[name]) {
		console.log("added already foo");
	} else {
		this.players[name] = new Player(name)
	}
}


var Player = function (name) {
	this.cards = ['ACE OF SPADES'];
	this.name = name
	return this;
}

module.exports.Game = Game;