const {Router} = require('express');

const drugs = require('../lib/drugs/index');

const router = new Router();

router.get('/category', async (req, res, next) => {
	const {id, name} = req.query;
	try{
		if(!id && !name){
			res.result = await drugs.getAllCategories();
		}else {
			res.result = await drugs.getCategory({id, name});
		}
		next();
	}catch(err){
		next(err);
	}
	next();
});

router.post('/category', (req, res, next) => {
	next();
});

router.put('/category', (req, res, next) => {
	next();
});

router.delete('/category', (req, res, next) => {
	next();
});

router.get('/', (req, res, next) => {
	next();
});

exports.name = 'drugs';
exports.module = router;
