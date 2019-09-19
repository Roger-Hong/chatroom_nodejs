// This is in-memory storage for messages.
const locks = require('locks');

// receiver => {sender => [messages]}
const receivers = new Map();
const receiverMutexes = new Map();

const getMutex = (username) => {
	if (!receiverMutexes.has(username)) {
		receiverMutexes.set(username, locks.createReadWriteLock());
	}
	return receiverMutexes.get(username);
}

exports.receiversMapForTest = receivers;

exports.send = function(sender, receiver, message, callback) {
	const mutex = getMutex(receiver);
	mutex.writeLock(() => {
		if (!receivers.has(receiver)) {
			receivers.set(receiver, new Map());
		}
		if (!receivers.get(receiver).has(sender)) {
			receivers.get(receiver).set(sender, []);
		}
		receivers.get(receiver).get(sender).push({
			message: message,
			timestamp: Date.now()
		});
		mutex.unlock();
	});
	return callback(null, null);
}

exports.read = function(sender, receiver, callback) {
	const mutex = getMutex(receiver);
	let messages = [];
	mutex.writeLock(() => {
		if (receivers.has(receiver) && receivers.get(receiver).has(sender)) {
			messages = receivers.get(receiver).get(sender);
			receivers.get(receiver).set(sender, []);
		}
		mutex.unlock();
	});
	return callback(null, messages);
}

// Return a map sender => # of messages
exports.messagesNotification = function(receiver, callback) {
	const mutex = getMutex(receiver);
	const numOfMessages = new Map();
	mutex.readLock(() => {
		if (!receivers.has(receiver)) {
			return;
		}
		for (let [sender, messages] of receivers.get(receiver)) {
			numOfMessages.set(sender, messages.length);
		}
		mutex.unlock();
	});
	return callback(null, numOfMessages);
}