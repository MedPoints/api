const config = require('config');
const bunyan = require('bunyan');

const logSettings = config.get('logger');

const loggers = {};

/**
 * @param {String} name
 * @returns {Logger}
 */
exports.getLogger = (name) => {
	if(loggers[name]){
		return loggers[name];
	}
	const loggerOptions = {
		name: name,
	};
	const logger = bunyan.createLogger(loggerOptions);
	loggers[name] = logger;
	return logger;
};


/**
 * @param {Logger} log
 * @return {Function}
 */
exports.getMiddlewareLogger = (log) => {
	return (req, res, next) => {
		req.log = log.child({className: 'SERVER', path: req.path, queryparams: req.query, method: req.method});
		req.log.info('INCOMING_REQUEST');
		next();
	}
};
