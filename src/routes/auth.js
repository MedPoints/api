const {Router} = require('express');

const users = require('../lib/users/index');

const validator = require('../validators/auth');

const router = new Router();


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
	
	}catch(err){
		next(err);
	}
});


exports.module = router;
exports.name = 'users';
