var express = require("express");

var server = express.createServer()

server.use(express.bodyParser());

server.set("view options", {
	layout: false
});

server.set("view engine", "ejs");
server.set("views", __dirname + "/views");
server.use("/static", express.static(__dirname + "/static"));

/*
var agent = navigator.userAgent.toLowerCase();
			var usePrivateView = ((agent.indexOf('iphone') != -1) || (agent.indexOf("android") != -1));
			if (usePrivateView) {
				alert("view your hand");
			} else {
				alert('view the board');
			}
			*/

var checkMobile = function (userAgent) {
	var ua = userAgent.toLowerCase();
	return ((ua.indexOf('iphone') != -1) || (ua.indexOf('android') != -1));
}

server.get("/", function (req, res) {
	var usePrivateView = checkMobile(req.headers['user-agent']);
	if (usePrivateView) {
		res.render("private");
	} else {
		res.render("board");
	}
});

server.listen(80);
console.log("Express server started.");