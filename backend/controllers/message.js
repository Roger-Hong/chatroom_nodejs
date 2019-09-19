const express = require('express');
const router = express.Router();
const { check, body, validationResult } = require('express-validator');
const MessageCache = require('../models/message');

router.post('/send', [
    check('sender').not().isEmpty(),
    check('receiver').not().isEmpty(),
    check('message').not().isEmpty()
  ], function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array() });
	}
	MessageCache.send(req.body.sender, req.body.receiver, req.body.message, (err, value) => {
		if (err !== null) {
			return res.status(500).json({error: err});
		}
		return res.json({});
	});
});

router.post('/read', [
    check('sender').not().isEmpty(),
    check('receiver').not().isEmpty()
  ], function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array() });
	}
	MessageCache.send(req.body.sender, req.body.receiver, (err, value) => {
		if (err !== null) {
			return res.status(500).json({error: err});
		}
		return res.json({messages: value});
	});
});

router.post('/messagesNotification', [
    check('receiver').not().isEmpty()
  ], function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array() });
	}
	// Returns a map sender => # of messages
	MessageCache.messagesNotification(req.body.receiver, (err, value) => {
		if (err !== null) {
			return res.status(500).json({error: err});
		}
		return res.json({messages: value});
	});
});

module.exports = router