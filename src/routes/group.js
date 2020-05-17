const {Router} = require('express');

const group = require('../lib/groups/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {id, name} = req.query;
	try{
		if(!id && !name){
			res.result = await group.getAllGroups({name}, req.paginator);
		}else {
			res.result = await group.getGroup(id);
		}
		next();
	}catch(err){
		next(err);
	}
	next();
});

router.post('/', async (req, res, next) => {
	try{
		res.data = await group.saveGroup(req.body);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.put('/', async (req, res, next) => {
	try{
		await group.updateGroup(req.body);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.delete('/', (req, res, next) => {
	res.result = 'OK';
	next();
});

exports.name = 'groups';
exports.module = router;
