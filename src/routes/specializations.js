const {Router} = require('express');

const specialization = require('../lib/specializations/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const paginator = req.paginator;
	try{
		res.result = await specialization.getSpecializations(paginator);
		next();
	}catch(err){
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	try{
		await specialization.saveSpecialization(req.body);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

exports.name = 'specializations';
exports.module = router;
