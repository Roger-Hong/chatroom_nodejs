// username => {token: String, expireTimestamp: Number}
const AccessTokens = new Map();

// # of milliseconds in 5 minutes.
const expireDuration = 5 * 60 * 1000;

exports.checkAccessToken = function(name, token, callback) {
	if (AccessTokens.get(name) === undefined) {
		return callback(new Error('Failed to get access token.'), null);
	}
	accessToken = AccessTokens.get(name);
	if (accessToken.token !== token) {
		return callback(new Error('Invalid access token.'), null);
	}
	if (accessToken.expireTimestamp < Date.now()) {
		return callback(new Error('Expired access token.'), null);
	}
	return callback(null, null);
};

exports.addAccessToken = function(name, token, callback) {
	AccessTokens.set(name, {token: token, expireTimestamp: Date.now() + expireDuration});
	return callback();
}