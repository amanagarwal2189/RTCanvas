var socket = io();
/*socket.on('connection', function(msg){
	console.log("Connected to server");
})
*/
var canvas, ctx = null;
socket.on('historyPath', function(msg){
	//draw recieved path
	for (i=0;i<msg.length;i++){
		recievePath(msg[i]);
	}
});

socket.on('path', function(msg){
	//draw recieved path
	recievePath(msg);
});

socket.on('clearHistory', function(msg){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});



var prevX, prevY, currX, currY = 0;
var isMouseDown = false;
function init(){
	canvas = document.getElementById('canvas');
	ctx=canvas.getContext("2d");
	fitCanvas();

/**
	ctx.beginPath();
	ctx.moveTo(10,10);
	ctx.lineTo(100,100);
	ctx.strokeStyle="blue";
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.closePath();
**/
canvas.addEventListener("mouseup",findpath);
canvas.addEventListener("mousedown",findpath);
canvas.addEventListener("mousemove",findpath);

//mobile compatability
canvas.addEventListener("touchstart",findpath);
canvas.addEventListener("touchend",findpath);
canvas.addEventListener("touchmove",findpath);
}

function fitCanvas(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function drawPath(){
	ctx.beginPath();
	ctx.moveTo(prevX,prevY);
	ctx.lineTo(currX, currY);
	ctx.strokeStyle="blue";
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.closePath();

	//now send this to other clients
	socket.emit("path", {px: prevX, py: prevY,cx:currX, cy:currY});
}

function findpath(){
	if (event.type === "mouseup" || event.type === "touchend" ){
		//console.log("Mouse is up");
		$("#canvas").removeClass("mouseDown");
		isMouseDown = false;
	}
	else if (event.type === "mousedown" || event.type === "touchstart"){
		//console.log("Mouse is down");
		isMouseDown = true;
		$("#canvas").addClass("mouseDown");
		//to start the drawing from the current position of the mouse
		// else it will continue from the place where drawing was left before
		// try commenting and yu will understand
		prevX = event.clientX;
		prevY = event.clientY;
		currX = event.clientX;
		currY = event.clientY;

	}
	else if (event.type === "mousemove" || event.type === "touchmove"){
		//console.log("Mouse is move");
		if(isMouseDown){
			prevX = currX;
			prevY = currY;
			currX = event.clientX;
			currY = event.clientY;
			drawPath();
		}
	}
}

function recievePath(path){
	ctx.beginPath();
	ctx.moveTo(path.px,path.py);
	ctx.lineTo(path.cx, path.cy);
	ctx.strokeStyle="blue";
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.closePath();
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	socket.emit("clearHistory", {});
}

init();