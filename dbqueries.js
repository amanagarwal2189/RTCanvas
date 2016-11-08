/*QUERY*/
connection.query('SELECT * from sessions', function(err, rows, fields) {
	if (!err)
  		console.log();
	else
   		console.log('Error while performing Query.');
});