'use strict';

const {Router} = require('express');

const users = require('../lib/users/index');

const validator = require('../validators/auth');

const router = new Router();

router.get('/:publicKey/:privateKey', validator.getUserInfo, async (req, res, next) => {
	try{
		res.result = await users.getUserInfo(req.params);
		next();
	}catch(e){
		next(e);
	}
});

router.post('/register', validator.registerValidator, async (req, res, next) => {
	try{
		res.result = await users.register(req.body);
		next();
	}catch(e){
		next(e);
	}
});

router.get('/confirm', validator.confirmValidator, async (req, res, next) => {
	try{
		res.result = await users.confirm(req.query);
		next();
	}catch(err){
		next(err);
	}
});

router.post('/auth', validator.authValidator, async (req, res, next) => {
	try{
		res.result = await users.auth(req.body);
		next();
	}catch(err){
		next(err);
	}
});

router.put('/update', validator.updateProfileValidator, async (req, res, next) => {
	try{
		res.result = await users.updateProfile(req.body);
		next();
	}catch(err){
		next(err);
	}
});

exports.module = router;
exports.name = 'users';
