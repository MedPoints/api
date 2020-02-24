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

router.post('/', async (req, res, next) => {
	const upload = req.body;
	try{
		await upload.addUpload(upload);
		res.result = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

exports.module = router;
exports.name = 'uploads';