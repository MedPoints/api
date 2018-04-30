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
		level: logSettings.level,
	};
	const logger = bunyan.createLogger(loggerOptions);
	loggers[name] = logger;
	return logger;
};