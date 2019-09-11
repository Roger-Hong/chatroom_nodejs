const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');
const UserModule = require('../models/user');

// Parameter: username, email, phone
// Figure out access token ???
router.post('/search', oneOf([
    check('username').not().isEmpty(),
    check('email').not().isEmpty(),
    check('phone').not().isEmpty()
  ]), function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const username = req.body.username;
	const email = req.body.email;
	const phone = req.body.phone;
	UserModule.search(username, email, phone, (err, users) => {
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json({users: users});
	});
});

module.exports = router