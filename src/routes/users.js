const {Router} = require('express');

const users = require('../lib/users/index');

const router = new Router();

router.get('/', async (req, res, next) => {
	const {walletId, walletKey} = req.query;
	res.result = await users.getUser(walletId, walletKey);
	next();
});

router.post('/register', async (req, res, next) => {
	const {walletId, walletKey} = req.body;
	res.result = await users.createUser(walletId, walletKey);
	next();
});

exports.module = router;
exports.name = 'users';
