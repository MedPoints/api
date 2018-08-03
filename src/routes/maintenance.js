const {Router} = require('express');

const maintenance = require('../lib/maintenance');

const router = new Router();

router.post('/importDrugs', async (req, res, next) => {
	try{
		await maintenance.importDrugs(req.body.result);
		res.status = 'OK';
		next();
	}catch(err){
		next(err);
	}
});

exports.name = 'maintenance';
exports.module = router;
