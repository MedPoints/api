'use strict';

const Promise = require('bluebird');

class BaseWorker {
	/**
	 * @param {Object} options
	 * @param {Logger} options.logger
	 */
	constructor(options={}){
		this._options = options;
		this._logger = options.logger;
		this._onClose = [];
		this._errorHandling();
	}
	init(config){
		throw new Error('NOT_IMPLEMENTED_METHOD');
	}
	_errorHandling(){
		process.on('SIGTERM', async () => {
			this._logger.warn('SIGTERM signal was handled');
			await Promise.all(this._onClose);
			process.exit();
		});

		process.on('uncaughtException', (ex) => {
			this._logger.error(ex.stack || ex, 'uncaughtException');
		});
		process.on('unhandledRejection', (rejection) => {
			this._logger.error(rejection, 'unhandledRejection');
		});
		process.on('message', async (msg) => {
			if (msg === 'shutdown') {
				await Promise.all(this._onClose);
				process.exit();
			}
		});
	}
}

exports.BaseWorker = BaseWorker;
