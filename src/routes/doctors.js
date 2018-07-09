const {Router} = require('express');

const doctors = require('../lib/doctors/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name, specialization} = req.query;
	const paginator = req.paginator;
	try{
		res.result = await doctors.getDoctor({name, id, specialization}, paginator);
		next();
	}catch(err){
		next(err);
	}
});


router.post('/', async (req, res, next) => {
	const doctor = req.body;
	try{
		await doctors.saveDoctor(doctor);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.put('/', async (req, res, next) => {
	const doctor = req.body;
	try{
		await doctors.updateDoctor(doctor);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.delete('/', async (req, res, next) => {
	const {id} = req.query;
	try{
		await doctors.deleteDoctor(id);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.post('/rating/:id', async (req, res, next) => {
	const id = req.params.id;
	const rate = req.body;
	try{
		await doctors.changeRateOfDoctor(id, rate);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});


exports.module = router;
exports.name = 'doctors';
