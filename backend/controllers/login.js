const express = require('express');
const router = express.Router();
const { check, body, validationResult } = require('express-validator');
const UserModule = require('../models/user');
const AccessTokenModule = require('./access_token');

router.get('/r', (req, res) => {
	return res.json({resp: 'Request received'});
});

// Parameter: username, password, email, phone
router.post('/register', [
    check('username').isLength({ min: 3 }),
    check('password').isLength({ min: 6 })
  ], function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const phone = req.body.phone;
	UserModule.register(username, password, email, phone, (err, accessToken) => {
		if (err !== null) {
			return res.status(500).send(err);
		}
		AccessTokenModule.addAccessToken(username, accessToken, () => {});
		return res.send({accessToken: accessToken});
	});
});

// Parameter: username, password, accessToken
router.post('/login', [
    body('username').not().isEmpty(),
    body('password').not().isEmpty(),
  ], function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const username = req.body.username;
	const password = req.body.password;
	const accessToken = req.body.accessToken;
	AccessTokenModule.checkAccessToken(username, accessToken, (err, data) => {
		if (err === null) {
			return res.send({accessToken: accessToken});
		}
		UserModule.login(username, password, (err, data) => {
			if (err === null) {
				return res.send({accessToken: data});
			}
			return res.status(401).send({ error: 'Unauthorized user.' });
		});
	});
});

module.exports = router