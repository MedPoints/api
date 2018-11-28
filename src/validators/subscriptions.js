'use strict';

const Promise = require('bluebird');
const Joi = require('joi');

const validate = Promise.promisify(Joi.validate, {context: Joi});

const log = require('../utils/logger').getLogger('VALIDATION');

const AddSubscriptionSchema = {
	email: Joi.string().email({minDomainAtoms: 2}).required(),
};

exports.addSubscriptions = async (req, res, next) => {
	try{
		await validate(req.body, AddSubscriptionSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};
