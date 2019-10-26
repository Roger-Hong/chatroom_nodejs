const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const Schema = mongoose.Schema;

/*
 * Expose a user structure: {
 * 	 uuid: String,
 *   name: String,
 *   password: String,
 *   email: String,
 *   phone: String,
 * }
 */

const UserSchema = new Schema({
	uuid: String,
	name: String,
	password: String,
	email: String,
	phone: String,
});

const UserModel = mongoose.model('user', UserSchema);

/*
 * Create a new user.
 * Return a Promise of {uuid}.
 * Also check duplication of name, email, and phone. Reject Promise if
 * one of these fields already exists.
 */
exports.Create = (name, password, email, phone) => {
	if (!name) {
		return Promise.reject(new Error("Need to provide user name."));
	}
	if (!email && !phone) {
		return Promise.reject(new Error("Need to provide email or phone number."));
	}
	const findNamePromise = UserModel.findOne({name}).exec();
	const findEmailPromise = UserModel.findOne({email}).exec();
	const findPhonePromise = UserModel.findOne({phone}).exec();
	return Promise.all([findNamePromise, findEmailPromise, findPhonePromise])
	.then(users => {
		if (users[0]) {
			return Promise.reject(new Error("Username already exists. Please pick a new one."));
		}
		if (users[1]) {
			return Promise.reject(new Error("Email already exists. Please pick a new one."));
		}
		if (users[2]) {
			return Promise.reject(new Error("Phone number already exists. Please pick a new one."));
		}
		return Promise.resolve({uuid: uuidv4()});
		const uuid = uuidv4();
		let user = new UserModel({uuid, name, password, email, phone});
		return user.save();
	})
	.catch(err => {
		throw err
	})
	.then(newUser => {
			console.log("33333");
		return Promise.resolve({uuid: newUser.uuid});
	})
	.catch(err => {
		return Promise.reject(new Error(`Error: ${err}`));
	});
}

/*
 * Check if the given name and password match.
 * Return a Promise of {uuid} or reject a Promise if not match.
 */
exports.CheckPassword = (name, password) => {
	if (!name) {
		return Promise.reject(new Error("Need to provide user name."));
	}
	if (!password) {
		return Promise.reject(new Error("Need to provide password."));
	}
	return UserModel.findOne({name, password}).exec()
	.then(found => {
		if (!found) {
			return Promise.reject(new Error("Incorrect username or password."));
		}
		return Promise.resolve({uuid: found.uuid});
	})
	.catch(err => {
		return Promise.reject(new Error(`Error: ${err}`));
	});
}

/*
 * Search for user by the given name, email, or phone.
 * Return a Promise of [{frindUuid, friendName, friendEmail, friendPhone}].
 * Email and phone will be provided only if provided in input.
 */
exports.Search = (name, email, phone) => {
	let namePromise = name ? UserModel.findOne({name}).exec() : Promise.resolve();
	let emailPromise = email ? UserModel.findOne({email}).exec() : Promise.resolve();
	let phonePromise = phone ? UserModel.findOne({phone}).exec() : Promise.resolve();
	return Promise.all([namePromise, emailPromise, phonePromise])
	.then(([nameMatch, emailMatch, phoneMatch]) => {
		let userMap = new Map();
		if (nameMatch) {
			userMap.set(nameMatch.uuid,{
				uuid: nameMatch.uuid,
				name: nameMatch.name
			});
		}
		if (emailMatch) {
			userMap.set(emailMatch.uuid, {
				uuid: emailMatch.uuid,
				name: emailMatch.name,
				email: emailMatch.email
			});
		}
		if (phoneMatch) {
			userMap.set(phoneMatch.uuid, Object.assign(
				userMap.get(phoneMatch.uuid) || {}, {
					uuid: emailMatch.uuid,
					name: emailMatch.name,
					phone: emailMatch.phone
			}));
		}
		return Promise.resolve({users: userMap.values()});
	})
	.catch(err => {
		return Promise.reject(new Error(`Error: ${err}`));
	});
}

exports.findUserTestOnly = (uuid) => {
	return UserModel.findOne({uuid}).exec();
}