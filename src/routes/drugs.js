const {Router} = require('express');

const drugs = require('../lib/drugs/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name, groupId, pharmacyId} = req.query;
	const paginator = req.paginator;
	try{
		res.result = await drugs.getDrugs({name, id, groupId, pharmacyId}, paginator);
		next();
	}catch(err){
		next(err);
	}
});


router.post('/', async (req, res, next) => {
	try{
		await drugs.saveDrug(req.body);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.get('/count', async (req, res, next) => {
	try {
		res.result = await drugs.getCount();
		next();
	}catch(err){
		next(err);
	}
});

router.put('/', async (req, res, next) => {
	const doctor = req.body;
	try{
		await drugs.updateDrug(doctor);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});


exports.name = 'drugs';
exports.module = router;
