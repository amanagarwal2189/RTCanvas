var express = require("express");
var app= express();

//this is what helps in socket connection
var http = require('http').Server(app);
var io = require('socket.io')(http);
//to maintain history of paths drawn
var historyPath=[];

//only this folder will be public. This is a keyword.. has to be "public"
app.use(express.static('public'));
app.set("port", process.env.PORT || "3000");

//connection
io.on('connection', function(socket){
	console.log('a user connected');

	// to push history to clients who just joined
	socket.emit('historyPath',historyPath);
	// to broadcast new message what a client has drawn to other connected clients (and not to itself)
	socket.on('path', function(msg){
		//console.log(msg);
		historyPath.push(msg);
		socket.broadcast.emit('path',msg);
	})

	socket.on('clearHistory', function(msg){
		//console.log(msg);
		historyPath=[];
		socket.broadcast.emit('clearHistory',{});
	})
});

//this is the resource which is to be fetched
/**app.get("/", function(req,res){
	res.send("Hello");
});**/
app.get("/", function(req,res){
	res.render("index.html");
});

app.get("/foo", function(req,res){
	res.send("The foo route");
});

//opens a port on your computer and starts a server
http.listen(app.get("port"), function(){
	console.log("Listening to port");
});