const {Router} = require('express');

const pharmacies = require('../lib/pharmacies/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name, drugId} = req.query;
	const paginator = req.paginator;
	try{
		res.result = await pharmacies.getPharmacies({name, id, drugId}, paginator);
		next();
	}catch(err){
		next(err);
	}
});


router.post('/', async (req, res, next) => {
	const pharmacy = req.body;
	try{
		await pharmacies.savePharmacy(pharmacy);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.put('/', async (req, res, next) => {
	const pharmacy = req.body;
	try{
		await pharmacies.updatePharmacy(pharmacy);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.delete('/', async (req, res, next) => {
	const {id} = req.query;
	try{
		await pharmacies.deletePharmacy(id);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.get('/count', async (req, res, next) => {
	try {
		res.result = await pharmacies.getCount();
		next();
	}catch(err){
		next(err);
	}
});


router.post('/rating/:id', async (req, res, next) => {
	const id = req.params.id;
	const rate = req.body;
	try{
		await pharmacies.changeRateOfPharmacy(id, rate);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});


exports.module = router;
exports.name = 'pharmacies';
