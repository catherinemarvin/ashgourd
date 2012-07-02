var Game = function () {
	this.players = {};
	this.gameState = {};
	return this;
}

Game.prototype.addPlayer = function (name) {
	console.log("added player");
	if (this.players[name]) {
		console.log("added already foo");
	} 
  else {
		this.players[name] = new Player(name, args)
	}
}

Game.prototype.update = function (data) {


}

var Player = function (name , id, args) {
	this.cards = ['ACE OF SPADES'];
	this.name = name;
  this.id = id;
  var fields = Object.keys(args)
  for (var i = 0 , ii = fields.length; i < ii; i = i + 1){
    var field = fields[i];
    this[field] = args[field];
  }
	return this;
}

module.exports.Game = Game;
