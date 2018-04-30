const config = require('config');
const cluster = require('cluster');

const {Master} = require('./master');
const {Worker} = require('./worker');

const settings = config.get('server');
const logger = require('../utils/logger').getLogger('WORKER');

exports.startServer = () => {
	process.on('uncaughtException', (ex) => {
		logger.error('uncaughtException', ex.stack || ex);
	});
	process.on('unhandledRejection', (rejection) => {
		logger.error(rejection, 'unhandledRejection');
	});
	
	let worker;
	if(cluster.isMaster){
		worker = new Master({logger: logger});
	}else{
		worker = new Worker({logger: logger});
	}
	worker.init(settings);
};