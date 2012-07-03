var express = require("express");
var logic = require("./lib/Game");
var server = express.createServer();
var io = require('socket.io').listen(server);
io.set("log level", 1);

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
	console.log("location: " + "/room/"+name+"/"+roomId)
	res.send({'location': "/room/"+name+"/"+roomId});

}

var checkMobile = function (userAgent) {
	var ua = userAgent.toLowerCase();
	return ((ua.indexOf('iphone') != -1) || (ua.indexOf('android') != -1));
}

server.get("/", function (req, res) {
	res.render('index');
});

server.get("/test", function (req, res) {
	res.render("private");
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
	if (name === "board"){
		console.log("rendering board");
		res.render("board");
	}
	else{
		console.log("rendering private view");
		//res.render("private" , game.players[name])
		res.render("private");
	}
})

io.sockets.on('connection', function(socket) {
  socket.emit('identify');
  socket.on('checkIn', function(data) {
    var roomId = data.roomId;
    var name = data.name;
    var additionalInfo = data.additionalInfo;
    var game = rooms[roomId]
    if (game) {
	    if (name !== 'board'){
	      game.addPlayer(name, socket.id, additionalInfo);
	      io.sockets.socket(socket.id).emit('initPlayer', { 'player' : game.players[name]})
	    }
	    else{
	      socket.emit('sync' , {gameState : game.gameState})
	    }
	  socket.set('roomId' , roomId)
	  socket.set('user' , name)   
		}
		else {
			console.log("entered without having made a game")
		}
  });
  socket.on('startGame' , function(data) {
    socket.get('roomId', function(err, roomId){
      if (err) {throw err;}
      var game = rooms[roomId];
      var players = game.players;
      var playerNames = Object.keys(players);
      var firstPlayerSocketId = players[playerNames[0]].id;
      io.sockets.socket(firstPlayerSocketId).emit('yourTurn', {turnNum : 0 , gameState : game.gameState});
    });
  });
  socket.on('endTurn', function(data) {
    socket.get('roomId', function(err, roomId){
      if (err) {throw err;}
      var turnNum = data.turnNum + 1;
      var game = rooms[roomId];
      var players = game.players;
      var playerNames = Object.keys(players);
      var indexOfNextPlayer = turnNum % playerNames.length
      var nextPlayerId =  players[playerNames[indexOfNextPlayer]].id
      io.sockets.socket(nextPlayerId).emit('yourTurn', {turnNum : turnNum});
    });
  });
  socket.on('updateGameState' , function(data){
    socket.get('roomId' , function(err, roomId){
      var game = rooms[roomId]
      game.update(data)
      socket.broadcast.to(room).emit('updates', data)
    });
  });
});

server.listen(80);
console.log("Express server started.");
