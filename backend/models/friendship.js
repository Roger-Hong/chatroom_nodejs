const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendshipStatus = {
	PENDING: "pending",
	ACCEPTED: "accepted",
}

const FriendshipSchema = new Schema({
	inviterName: String,
	inviteeName: String,
	status: String,
	timestamp: Number
})

const FriendshipModel = mongoose.model('friendship', FriendshipSchema);

exports.db = FriendshipModel;
exports.friendshipStatus = FriendshipStatus;

const checkStatusAndUpdate = (inviter, invitee, currentStatus, newStatus) => {
	switch (currentStatus) {
		case FriendshipStatus.PENDING:
			break;
		case FriendshipStatus.ACCEPTED:
			throw new Error('Invalid update request.');
			break;
	}
	return FriendshipModel.update({
		inviterName: inviter,
		inviteeName: invitee,
		status: newStatus,
		timestamp: Date.now()
	}).exec();
}

exports.invite = function(inviter, invitee, callback) {
	FriendshipModel.findOne({
		inviterName: inviter,
		inviteeName: invitee
	}).exec()
	.then(result => {
		let friendship = new FriendshipModel({
			inviterName: inviter,
			inviteeName: invitee,
			status: FriendshipStatus.PENDING,
			timestamp: Date.now()
		});
		if (!result) {
			return friendship.save();
		}
		return checkStatusAndUpdate(inviter, invitee, result.status, FriendshipStatus.PENDING);
	})
	.catch(err => {
		throw new Error(`Error in searching friendship: ${err}`);
	})
	.then(result => {
		return callback(null, null);
	})
	.catch(err => {
		return callback(new Error(err), null);
	});
}

exports.accept = function(inviter, invitee, callback) {
	FriendshipModel.findOne({
		inviterName: inviter,
		inviteeName: invitee
	}).exec()
	.then(result => {
		if (!result) {
			throw new Error('Invitation not found.');
		}
		return checkStatusAndUpdate(inviter, invitee, result.status, FriendshipStatus.ACCEPTED);
	})
	.catch(err => {
		throw new Error(`Error in accepting invitation: ${err}`);
	})
	.then(result => {
		return FriendshipModel.findOneAndRemove({
			inviterName: invitee,
			inviteeName: inviter
		}).exec();
	})
	.catch(err => {
		throw new Error(`Error in delete invitation: ${err}`);
	})
	.then(result => {
		return callback(null, null);
	})
	.catch(err => {
		return callback(err, null);
	});
}

exports.reject = function(inviter, invitee, callback) {
	FriendshipModel.findOne({
		inviterName: inviter,
		inviteeName: invitee,
		status: FriendshipStatus.PENDING
	}).exec()
	.then(result => {
		if (!result) {
			throw new Error("Pending invitation not found.");
		}
		return FriendshipModel.findOneAndRemove({
			inviterName: inviter,
			inviteeName: invitee
		}).exec()
	})
	.catch(err => {
		throw new Error(`Error in searching friendship: ${err}`);
	})
	.then(result => {
		return callback(null, null);
	})
	.catch(err => {
		throw callback(new Error(`Error in delete invitation: ${err}`), null);
	})
}

exports.isFriend = function(user1, user2, callback) {
	let searchPromise1 = FriendshipModel.findOne({
		inviterName: user1,
		inviteeName: user2,
		status: FriendshipStatus.ACCEPTED
	}).exec();
	let searchPromise2 = FriendshipModel.findOne({
		inviterName: user2,
		inviteeName: user1,
		status: FriendshipStatus.ACCEPTED
	}).exec();
	Promise.all([searchPromise1, searchPromise2])
	.then(friendships => {
		if (!friendships[0] && !friendships[1]) {
			return callback(null, false);
		}
		return callback(null, true);
	})
	.catch(err => {
		return callback(new Error(`Error in searching accepted friendship: ${err}`), null);
	});
}

exports.delete = function(user1, user2, callback) {
	let searchPromise1 = FriendshipModel.findOneAndRemove({
		inviterName: user1,
		inviteeName: user2,
		status: FriendshipStatus.ACCEPTED
	}).exec();
	let searchPromise2 = FriendshipModel.findOneAndRemove({
		inviterName: user2,
		inviteeName: user1,
		status: FriendshipStatus.ACCEPTED
	}).exec();
	Promise.all([searchPromise1, searchPromise2])
	.then(result => {
		return callback(null, null);
	})
	.catch(err => {
		return callback(new Error(`Error in deleting accepted friendship: ${err}`), null);
	});
}