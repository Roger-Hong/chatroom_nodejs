const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	fromUserId: String,
	toUserId: String,
	message: String,
	timestamp: Number
})

const Message = mongoose.model('message', MessageSchema);