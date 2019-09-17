const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String,
	password: String,
	email: String,
	phone: String,
});

// Convert an object user to exposed version of user.
const externalUser = (user) => {
	if (!user) {
		return {};
	}
	return {
		name: user.name,
		password: user.password,
		email: user.email,
		phone: user.phone
	};
};

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
		let user = new UserModel({
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

// Search by name, email, or phone.
exports.search = function(name, email, phone, callback) {
	let namePromise = name ? UserModel.findOne({name: name}).exec() : Promise.resolve();
	let emailPromise = email ? UserModel.findOne({email: email}).exec() : Promise.resolve();
	let phonePromise = phone ? UserModel.findOne({phone: phone}).exec() : Promise.resolve();
	Promise.all([namePromise, emailPromise, phonePromise])
	.then(users => {
		let nameMap = new Map();
		let foundUsers = [];
		for (u of users) {
			if (!u) {
				continue;
			}
			if (!nameMap.has(u.name)) {
				foundUsers.push(u);
				nameMap.set(u.name, true);
			}
		}
		foundUsers = foundUsers.map(foundUser => externalUser(foundUser));
		return callback(null, foundUsers);
	})
	.catch(err => {
		return callback(new Error('Error in searching friend: ' + err));
	});
}