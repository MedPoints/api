'use strict';

const {Router} = require('express');

const tickets = require('../lib/tickets/index');
const validator = require('../validators/tickets');

const router = new Router();


router.post('/create', validator.createTicketValidator, async (req, res, next) => {
	try{
		res.result = await users.register(req.body);
		next();
	}catch(e){
		next(e);
	}
});

exports.module = router;
exports.name = 'tickets';
