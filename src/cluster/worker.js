const express = require('express');
const bodyParser = require('body-parser');

const routes = require('../routes/routes');
const {BaseWorker} = require('./baseworker');
const DAL = require('../dal/index');

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
		DAL.initDAL();

		const app = express();
		app.use(bodyParser.json());
		routes.init(app);
		app.listen(config.port, () => {
			this._logger.info('start server');
		});
	}
}

exports.Worker = Worker;
