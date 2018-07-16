const {Router} = require('express');

const services = require('../lib/services/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name} = req.query;
	const paginator = req.paginator;
	try{
		res.result = await services.getServices({name, id}, paginator);
		next();
	}catch(err){
		next(err);
	}
});


router.post('/', async (req, res, next) => {
	const pharmacy = req.body;
	try{
		await services.saveService(pharmacy);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.put('/', async (req, res, next) => {
	const pharmacy = req.body;
	try{
		await services.updateService(pharmacy);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.delete('/', async (req, res, next) => {
	const {id} = req.query;
	try{
		await services.deleteService(id);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.get('/count', async (req, res, next) => {
	try {
		res.result = await services.getCount();
		next();
	}catch(err){
		next(err);
	}
});

// router.post('/rating/:id', async (req, res, next) => {
// 	const id = req.params.id;
// 	const rate = req.body;
// 	try{
// 		await pharmacies.changeRateOfDoctor(id, rate);
// 		res.result = 'OK';
// 		next();
// 	}catch(err){
// 		next(err);
// 	}
// });


exports.module = router;
exports.name = 'services';
