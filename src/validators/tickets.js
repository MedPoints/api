'use strict';

const Promise = require('bluebird');
const Joi = require('joi');

const validate = Promise.promisify(Joi.validate, {context: Joi});

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
		await validate(req.body, CreateTicketSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};

exports.getTicketsByUser = async (req, res, next) => {
	try{
		await validate(req.params, GetTicketsByUserSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};
