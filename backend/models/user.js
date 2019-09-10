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

// Example of chained promise.
exports.register = function(name, password, email, phone, callback) {
	UserModel.findOne({name: name}).exec()
	.then(foundName => {
		if (foundName !== null) {
			throw new Error('Username already exists. Please pick a new one.');
		}
		if (email) {
			return UserModel.findOne({email: email}).exec();
		}
		return Promise.resolve('no email');
	})
	.catch(err => {
		throw new Error(`Error in finding username: ${err}`);
	})
	.then(foundEmail => {
		if (foundEmail !== 'no email' && foundEmail !== null) {
			throw new Error('Email already exists. Please pick a new one.');
		}
		if (phone) {
			return UserModel.findOne({phone: phone}).exec();
		}
		return Promise.resolve('no phone');
	})
	.catch(err => {
		throw new Error(`Error in finding email: ${err}`);
	})
	.then(foundPhone => {
		if (foundPhone !== 'no phone' && foundPhone !== null) {
			throw new Error('Phone already exists. Please pick a new one.');
		}
		var user = new UserModel({
			name: name,
			password: password,
			email: email,
			phone: phone
		});
		return user.save();
	})
	.catch(err => {
		throw new Error(`Error in finding phone: ${err}`);
	})
	.then(u => {
		return callback(null, uuidv4());
	})
	.catch(err => {
		return callback(new Error('Error in creating new user. Error: ' + err), null);
	});
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