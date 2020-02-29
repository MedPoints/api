const {Router} = require('express');

const tokens = require('../lib/tokens/index');

const router = new Router();

router.get('/:publicKey', async (req, res, next) => {
  const {publicKey} = req.params;
	try{
		res.result = await tokens.getTokensByPublicKey(publicKey);
		next();
	}catch(e){
		next(e);
	}
});

router.post('/', async (req, res, next) => {
	const token = req.body;
	try{
		await tokens.addToken(token);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

router.get('/:publicKey/count', async (req, res, next) => {
  const {publicKey} = req.params;
	try{
		res.result = await tokens.countTokensByPublicKey(publicKey);
		next();
	}catch(e){
		next(e);
	}
});

exports.module = router;
exports.name = 'tokens';