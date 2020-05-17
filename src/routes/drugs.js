'use strict';

const {Router} = require('express');

const drugs = require('../lib/drugs/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name, groupId, pharmacyId, filter} = req.query;
	const paginator = req.paginator;
	try{
		res.result = await drugs.getDrugs({name, id, groupId, pharmacyId, filter}, paginator);
		next();
	}catch(err){
		next(err);
	}
});

router.get('/timer', async (req, res, next) => {
	const {interval} = req.query;
	try{
		res.result = await drugs.getDrugsByInterval(interval);
		next();
	}catch(err){
		next(err);
	}
});


router.post('/', async (req, res, next) => {
	try{
		res.result = await drugs.saveDrug(req.body);
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
	try{
		await drugs.updateDrug(req.body);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.delete('/', async (req, res, next) => {
	const {id} = req.body;
	try{
		await drugs.deleteDrug(id);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});


exports.name = 'drugs';
exports.module = router;
