var express = require("express");
var logic = require("./lib/Game");
var server = express.createServer();
var io = require('socket.io').listen(server);

server.use(express.bodyParser());

server.set("view options", {
	layout: false
});

server.set("view engine", "ejs");
server.set("views", __dirname + "/views");
server.use("/static", express.static(__dirname + "/static"));

var rooms = {}
/*
var agent = navigator.userAgent.toLowerCase();
			var usePrivateView = ((agent.indexOf('iphone') != -1) || (agent.indexOf("android") != -1));
			if (usePrivateView) {
				alert("view your hand");
			} else {
				alert('view the board');
			}
			*/

var addRoom = function (name, roomId, game, res){
	console.log("adding a room");
	rooms[roomId] = game;
	//res.redirect("http://localhost/room/"+name+"/"+roomId);
	//res.redirect("http://www.google.com");
	res.send({'location': "/room/"+name+"/"+roomId});

}

var checkMobile = function (userAgent) {
	var ua = userAgent.toLowerCase();
	return ((ua.indexOf('iphone') != -1) || (ua.indexOf('android') != -1));
}

server.get("/", function (req, res) {
	res.render('index');
});

server.get("/room/:roomId", function (req, res) {
	var roomId = req.params.roomId
	var toReturn = "";
	if (! rooms[roomId]){
		console.log("making new room");
		//rooms[roomId] = {players : {} , gameState : {} }
		addRoom( req.query.name, roomId,  new logic.Game() , res )
	}
	else{
		console.log("room: "+roomId);
		res.send({"location" : "room/"+req.query.name+"/"+roomId})
		//res.redirect("room/"+req.query.name+"/"+roomId)
	}
});

server.get("/room/:name/:roomId", function (req, res) {
	console.log("woo");
	var roomId = req.params.roomId;
	var name = req.params.name;
	var game = rooms[roomId]
	console.log(roomId);
	console.log(name);
	console.log(game);
	if (name === "board"){
		console.log("rendering board");
		//res.render("board", game.gameState)
		res.render("board", {gameState : game.gameState});
	}
	else{
		//res.render("private" , game.players[name])
		res.render("private");
	}
})
/*
io.sockets.on('connection', function(socket) {
  socket.emit('identify');
  socket.on('checkIn', function (incoming) {
      
  }); 

})
*/

server.listen(80);
console.log("Express server started.");
