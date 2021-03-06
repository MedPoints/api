'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {createPaginator} = require('./paginator');

const {getMiddlewareLogger} = require('../utils/logger');

const routes = [
	require('./doctors'),
	require('./hospitals'),
	require('./drugs'),
	require('./pharmacies'),
	require('./services'),
	require('./group'),
	require('./specializations'),
	require('./maintenance'),
	require('./auth'),
	require('./tickets'),
	require('./faq'),
	require('./subscriptions'),
	require('./uploads'),
	require('./foundations'),
	require('./tokens'),
	require('./notifications'),
];

const PREFIX = '/api';

exports.initServer = ({log}) => {
	const app = express();
	app.use(bodyParser.json({limit: '10mb'}));
	app.use(getMiddlewareLogger(log));
	app.use((req, res, next) => {
		req.paginator = createPaginator(req.query);
		next();
	});
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
		let statusCode = 500;
		if(err.name === 'ValidationError'){
			statusCode = 422;
		}
		res.status(statusCode).json({error: err.message});
		next();
	});
	return app;
};
