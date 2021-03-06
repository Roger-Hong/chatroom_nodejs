const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { PORT, MONGODB_PATH } = require('./config');

var app = express();

// Connect to Mongodb
mongoose.connect(MONGODB_PATH);
mongoose.connection.once('open', () => {
	console.log('Connection has been made.');
}).on('error', (error) => {
	console.log('Connection error:', error);
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}...`);
})

// Export our app for testing purposes
module.exports=app;