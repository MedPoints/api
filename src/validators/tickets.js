'use strict';

const Joi = require('joi');

const log = require('../utils/logger').getLogger('VALIDATION');

const GetTicketsByUserSchema = {
	publicKey: Joi.string().required(),
	privateKey: Joi.string().required(),
};

const CreateTicketSchema = Joi.object({
	publicKey: Joi.string().required(),
	privateKey: Joi.string().required(),
	title: Joi.string().required(),
	subject: Joi.string().required(),
	text: Joi.string().required(),
});

exports.createTicketValidator = async (req, res, next) => {
	try{
		await CreateTicketSchema.validate(req.body);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};

exports.getTicketsByUser = async (req, res, next) => {
	try{
		await GetTicketsByUserSchema.validate(req.params);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};
