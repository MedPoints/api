const {Router} = require('express');

const hospital = require('../lib/hospitals/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name, country} = req.query;
	try{
		res.result = await hospital.getHospital({id, name, country}, req.paginator);
		next();
	}catch(err){
		next(err);
	}
});


router.get('/locations', async (req, res, next) => {
    try{
        res.result = await hospital.getHospitalsLocations();
        next();
    }catch(err){
        next(err);
    }
});


router.post('/', async (req, res, next) => {
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

router.get('/count', async (req, res, next) => {
	try {
		res.result = await hospital.getCount();
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
