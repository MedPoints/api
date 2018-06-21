const {Router} = require('express');

const doctors = require('../lib/doctors/index');

const router = new Router();

router.get('/', async (req, res) => {
	const {id, name} = req.query;
	try{
		const doctor = await doctors.getDoctor({name, id});
		res.send({result: doctor});
	}catch(err){
		res.status(500).send({error: err});
	}
});


router.post('/', async (req, res) => {
	const doctor = req.body;
	try{
		await doctors.saveDoctor(doctor);
		res.send({result: 'OK'});
	}catch(err){
		res.status(500).send({error: err});
	}
});

router.put('/', async (req, res) => {
	const doctor = req.body;
	try{
		await doctors.updateDoctor(doctor);
		res.send({result: 'OK'});
	}catch(err){
		res.status(500).send({error: err});
	}
});

router.delete('/', async (req, res) => {
	const {id} = req.query;
	try{
		await doctors.deleteDoctor(id);
		res.send({result: 'OK'});
	}catch(err){
		res.status(500).send({error: err});
	}
});

router.post('/rating/:id', async (req, res) => {
	const id = req.params.id;
	const {score} = req.body;
	try{
		await doctors.changeRateOfDoctor(id, score);
		res.send({result: 'OK'});
	}catch(err){
		res.status(500).send({error: err});
	}
});


exports.module = router;
exports.name = 'doctors';
