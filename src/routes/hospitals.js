const {Router} = require('express');

const hospital = require('../lib/hospitals/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name} = req.query;
	try{
		res.result = await hospital.getHospital({id, name});
		next();
	}catch(err){
		next(err);
	}
});


router.post('/', async (req, res, next) => {
	const hospital = req.body;
	try{
		await hospital.saveHospital(req.body);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.put('/', async (req, res, next) => {
	const hospital = req.body;
	try{
		await hospital.updateHospital(hospital);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.delete('/', async (req, res, next) => {
	const {id} = req.query;
	try{
		await hospital.deleteHospital(id);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

exports.module = router;
exports.name = 'hospitals';
