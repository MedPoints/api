const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const {getMiddlewareLogger} = require('../utils/logger');

const routes = [
	require('./doctors'),
	require('./hospitals')
];

const PREFIX = '/api';

exports.initServer = ({log}) => {
	const app = express();
	app.use(bodyParser.json());
	app.use(getMiddlewareLogger(log));
	for(const route of routes){
		app.use(path.join(PREFIX, route.name), route.module);
		log.debug({module: route.name}, `module was loaded`);
	}
	app.use((req, res, next) => {
		if(!res.result){
			next();
			return;
		}
		res.json({
			error: null,
			result: res.result
		});
		next();
	});
	app.use((err, req, res, next) => {
		req.log.error(err, 'INTERNAL_ERROR');
		res.status(500).json({error: err});
		next();
	});
	return app;
};
