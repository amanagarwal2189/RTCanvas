/*
function init(){
	$("#canvas").on("mouseup mousedown mousemove touchstart touchend touchmove",function(event){
        findpath(event);
    });
    $("#saveFile").on('click', function(event){
    	downloadFile(this, 'canvas.jpg');
    });
}
connection.query('SELECT * from sessions', function(err, rows, fields) {
	if (!err)
  		console.log();
	else
   		console.log('Error while performing Query.');
});*/

function signup(){
	console.log("in signup "+$("#user_name").val());
}

function signin(){
	console.log("in signin");
}