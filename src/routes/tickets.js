'use strict';

const {Router} = require('express');

const tickets = require('../lib/tickets/index');
const validator = require('../validators/tickets');

const router = new Router();


router.get('/:publicKey/:privateKey', validator.getTicketsByUser, async (req, res, next) => {
	try{
		res.result = await tickets.getTicketsByUser(req.params);
		next();
	}catch(e){
		next(e);
	}
});

router.post('/create', validator.createTicketValidator, async (req, res, next) => {
	try{
		res.result = await tickets.createTicket(req.body);
		next();
	}catch(e){
		next(e);
	}
});

exports.module = router;
exports.name = 'tickets';
