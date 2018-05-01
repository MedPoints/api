const express = require('express');

const routes = require('../routes/routes');
const {BaseWorker} = require('./baseworker');

class Worker extends BaseWorker{
	/**
	 * @param {Object} options
	 * @param {Logger} options.logger
	 */
	constructor(options={}){
		super(options);
		this._logger = options.logger;
	}

	/**
	 * @param {Object} config
	 * @param {Number|String} [config.port]
	 */
	init(config){
		const app = express();
		app.use('/api', routes.init());
		
		app.listen(config.port, () => {
			this._logger.info('start server');
		});
	}
}

exports.Worker = Worker;
