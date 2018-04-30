class BaseWorker {
	/**
	 * @param {Object} options
	 * @param {Logger} options.logger
	 */
	constructor(options={}){
		this._options = options;
		this._logger = options.logger;
	}
	init(config){
		throw new Error('NOT_IMPLEMENTED_METHOD');
	}
}

exports.BaseWorker = BaseWorker;
