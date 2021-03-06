const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');
const UserModule = require('../models/user');
const FriendshipModel = require('../models/friendship');

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

router.post('/invite', [
    check('inviter').not().isEmpty(),
    check('invitee').not().isEmpty(),
  ], function(req, res) {
  	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const inviter = req.body.inviter;
	const invitee = req.body.invitee;
	FriendshipModel.invite(inviter, invitee, (err, value) => {
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json({});
	})
  });

router.post('/accept', [
    check('inviter').not().isEmpty(),
    check('invitee').not().isEmpty(),
  ], function(req, res) {
  	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const inviter = req.body.inviter;
	const invitee = req.body.invitee;
	FriendshipModel.accept(inviter, invitee, (err, value) => {
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json({});
	})
  });

router.post('/reject', [
    check('inviter').not().isEmpty(),
    check('invitee').not().isEmpty(),
  ], function(req, res) {
  	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const inviter = req.body.inviter;
	const invitee = req.body.invitee;
	FriendshipModel.reject(inviter, invitee, (err, value) => {
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json({});
	})
  });

router.post('/delete', [
    check('inviter').not().isEmpty(),
    check('invitee').not().isEmpty(),
  ], function(req, res) {
  	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const inviter = req.body.inviter;
	const invitee = req.body.invitee;
	FriendshipModel.delete(inviter, invitee, (err, value) => {
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json({});
	})
  });

router.post('/isFriend', [
    check('user1').not().isEmpty(),
    check('user2').not().isEmpty(),
  ], function(req, res) {
  	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const user1 = req.body.user1;
	const user2 = req.body.user2;
	FriendshipModel.isFriend(user1, user2, (err, value) => {
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json({isFriend: value});
	})
  });

module.exports = router