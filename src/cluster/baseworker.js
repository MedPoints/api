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
		const graceful = async () => {
			this._logger.warn('SIGTERM signal was handled');
			await Promise.all(this._onClose);
		};
		process.on('SIGTERM', graceful);

		process.on('uncaughtException', (ex) => {
			this._logger.error(ex.stack || ex, 'uncaughtException');
		});
		process.on('unhandledRejection', (rejection) => {
			this._logger.error(rejection, 'unhandledRejection');
		});
		
	}
}

exports.BaseWorker = BaseWorker;
