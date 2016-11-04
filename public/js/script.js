var socket = io();
var canvas, ctx = null;
var prevX, prevY, currX, currY = 0;
var isMouseDown = false;
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

function init(){
	canvas = document.getElementById('canvas');
	ctx=canvas.getContext("2d");
	fitCanvas();

	$("#canvas").on("mouseup mousedown mousemove touchstart touchend touchmove",function(event){
        findpath(event);
    });
    $("#saveFile").on('click', function(event){
    	downloadFile(this, 'canvas.jpg');
    });
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

function findpath(event){
	if (event.type === "mouseup" || event.type === "touchend" ){
		$("#canvas").removeClass("mouseDown");
		isMouseDown = false;
	}
	else if (event.type === "mousedown" || event.type === "touchstart"){
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

function downloadFile(link, filename) {
    link.href = $('#canvas')[0].toDataURL('image/jpeg');
    link.download = filename;
}

init();