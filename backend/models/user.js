const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String,
	password: String,
	email: String,
	phone: String,
});

const UserModel = mongoose.model('user', UserSchema);

exports.register = function(name, password, email, phone, callback) {
	UserModel.findOne({name: name}).then((result) => {
		if (result !== null) {
			return callback(new Error('Username already exists. Please pick a new one.'), null);
		}
		var user = new UserModel({
			name: name,
			password: password,
			email: email,
			phone: phone
		});
		user.save().then((u) => {
			// Return an access token.
			return callback(null, uuidv4());
		}).catch((error) => {
			return callback(new Error('Error in creating new user. Error: ' + error), null);
		});
	})
};

exports.login = function(name, password, callback) {
	UserModel.findOne({name: name, password: password}).then((result) => {
		if (result !== null) {
			// Return an access token.
			return callback(null, uuidv4());
		}
		return callback(new Error('Invalid username or password.'), null);
	});
}