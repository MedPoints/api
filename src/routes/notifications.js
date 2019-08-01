'use strict';

const {Router} = require('express');
const notifications = require('../lib/notifications/index');

const router = new Router();

router.post('/renderBook', async (req, res, next) => {
	try {
		await notifications.renderBook(req.body);
		res.result = 'OK';
		next();
	} catch(err){
		next(err);
	}
});

exports.name = 'notifications';
exports.module = router;
