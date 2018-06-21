const path = require('path');

const logger = require('../utils/logger').getLogger('ROUTES');

const routes = [
	require('./doctors'),
	require('./hospitals')
];

const PREFIX = '/api';

exports.init = (app) => {
	for(const route of routes){
		app.use(path.join(PREFIX, route.name), route.module);
		logger.debug({module: route.name}, `module was loaded`);
	}
};
