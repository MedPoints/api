const {Router} = require('express');

const foundations = require('../lib/foundations/index');

const router = new Router();

router.get('/:publicKey', async (req, res, next) => {
  const {publicKey} = req.params;
	try{
		res.result = await foundations.getFoundationsByPublicKey(publicKey);
		next();
	}catch(e){
		next(e);
	}
});

router.post('/', async (req, res, next) => {
	const foundation = req.body;
	try{
		await foundations.addFoundation(foundation);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

exports.module = router;
exports.name = 'foundations';