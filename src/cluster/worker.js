'use strict';

const routes = require('../routes/routes');
const {BaseWorker} = require('./baseworker');
const DAL = require('../dal/index');


class Worker extends BaseWorker {
	/**
	 * @param {Object} options
	 * @param {Logger} options.logger
	 */
	constructor(options={}){
		super(options);
	}

	/**
	 * @param {Object} config
	 * @param {Number|String} [config.port]
	 */
	init(config){
		const {_logger: log} = this;
		DAL.initDAL();
		const app = routes.initServer({log: this._logger});
		const server = app.listen(config.port, '0.0.0.0', () => {
			log.info({port: config.port}, 'start server');
		});
		this._onClose.push(async () => {
			await server.close();
			log.info('server connection closed');
		});
	}
}

exports.Worker = Worker;
