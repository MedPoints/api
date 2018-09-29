'use strict';

const {Router} = require('express');

const tickets = require('../lib/faq/index');
const validator = require('../validators/faq');

const router = new Router();


router.post('/create', validator.createQuestionValidator, async (req, res, next) => {
	try{
		res.result = await tickets.createQuestion(req.body);
		next();
	}catch(e){
		next(e);
	}
});

exports.module = router;
exports.name = 'faq';
