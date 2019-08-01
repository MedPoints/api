'use strict';

const Promise = require('bluebird');
const Joi = require('joi');

const validate = Promise.promisify(Joi.validate, {context: Joi});


const log = require('../utils/logger').getLogger('VALIDATION');

const CreateQuestionSchema = {
    name: Joi.string().required(),
    email: Joi.string().email({minDomainAtoms: 2}).required(),
    text: Joi.string().required(),
};

exports.createQuestionValidator = async (req, res, next) => {
	try{
		await validate(req.body, CreateQuestionSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};
