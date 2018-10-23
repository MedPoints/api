const {Router} = require('express');

const doctors = require('../lib/doctors/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name, specialization, service, hospital, filter} = req.query;
	const paginator = req.paginator;
	try{
		if(id){
			res.result = await doctors.getDoctorById(id);
		} else{
			res.result = await doctors.getDoctors({name, specialization, service, hospital, filter}, paginator);
		}
		next();
	}catch(err){
		next(err);
	}
});

router.get('/:id/services', async (req, res, next) => {
	const {id} = req.params;
	try{
		res.result = await doctors.getServicesByDoctorId(id);
		next();
	}catch(err){
		next(err);
	}
});

router.get('/:id/hospitals', async (req, res, next) => {
	const {id} = req.params;
	const {service} = req.query;
	try{
		res.result = await doctors.getHospitalsByDoctor({id, service});
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

router.get('/count', async (req, res, next) => {
	try {
		res.result = await doctors.getCount();
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
