var express = require('express');
//const { check, oneOf, validationResult } = require('express-validator');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var expressWs = require('express-ws')(app);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

var userCount = 0;
app.get('/', (req, res) => {
	if (userCount == 2) {
		res.render('too_many_users');
		return
	}
	res.render('index', {userId: userCount});
	userCount++;
});

app.ws('/chat', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
    setTimeout(() => {ws.send("aaa");}, 1000);
  });
  console.log('socket', req.testing);
});

app.listen(3001, () => {
	console.log('Server started on port 3001...');
}) 