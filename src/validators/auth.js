'use strict';

const Promise = require('bluebird');
const Joi = require('joi');

const validate = Promise.promisify(Joi.validate, {context: Joi});

const log = require('../utils/logger').getLogger('VALIDATION');

const publicKey = Joi.string().required();
const privateKey = Joi.string().required();

const UserSchema = Joi.object({
	publicKey, privateKey,
	email: Joi.string().email({minDomainAtoms: 2}).optional(),
	firstName: Joi.string().optional(),
	lastName: Joi.string().optional(),
	gender: Joi.string().optional(),
});

const AuthSchema = Joi.object({
	publicKey, privateKey
});

const ConfirmSchema = Joi.object({
	token: Joi.string().required()
});

const FavoriteSchema = Joi.object({
	id: Joi.string().required(),
	type: Joi.string().required(),
});

exports.registerValidator = async (req, res, next) => {
	try{
		await validate(req.body, UserSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};

exports.getUserInfo = async (req, res, next) => {
	try{
		await validate(req.params, AuthSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};

exports.authValidator = async (req, res, next) => {
	try{
		await validate(req.body, AuthSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};

exports.confirmValidator = async (req, res, next) => {
	try{
		await validate(req.query, ConfirmSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};

exports.updateProfileValidator = async (req, res, next) => {
	try{
		await validate(req.body, UserSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};

exports.addToFavorites = async (req, res, next) => {
	try{
		await validate(req.body, FavoriteSchema);
		next();
	}catch(err){
		log.error('validation error', err);
		next(err);
	}
};
