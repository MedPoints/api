const {Router} = require('express');

const uploads = require('../lib/uploads/index');

const router = new Router();

router.get('/:publicKey', async (req, res, next) => {
  const {publicKey} = req.params;
	try{
		res.result = await uploads.getUploadsByPublicKey(publicKey);
		next();
	}catch(e){
		next(e);
	}
});