const {Router} = require('express');

const router = new Router();

router.get('/category', (req, res, next) => {
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

router.get('/category/:id');

exports.name = 'drugs';
exports.module = router;
