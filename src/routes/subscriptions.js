'use strict';

const {Router} = require('express');

const validator = require('../validators/subscriptions');
const subscriptions = require('../lib/subscriptions/index');

const router = new Router();

router.post('/add', validator.addSubscriptions, async (req, res, next) => {
	try{
		res.result = await subscriptions.addSubscription(req.body.email);
		next();
	}catch(err){
		next(err);
	}
});

exports.module = router;
exports.name = 'subscriptions';
