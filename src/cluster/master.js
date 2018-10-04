const os = require('os');
const cluster = require('cluster');

const {BaseWorker} = require('./baseworker');

class Master extends BaseWorker {
	/**
	 * @param {Object} options
	 * @param {Logger} options.logger
	 */
	constructor(options={}){
		super(options);
		this._workers = {};
	}
	
	/**
	 * @param {Object} config
	 * @param {Number} [config.maxProcess]
	 */
	init(config){
		this._logger.info('init main worker');
		const workers = config.maxProcess || os.cpus().length;
		for(let i = 0; i < workers; i++){
			this._createWorkers();
		}
	}
	
	/**
	 * @private
	 */
	_createWorkers(){
		const worker = cluster.fork();
		const pid = worker.process.pid;
		this._logger.info({workerPid: pid}, 'create new worker');
		this._workers[pid] = worker;
		worker.on('exit', () => {
			this._logger.info({workerPid: pid}, 'worker died. Restart');
			delete this._workers[pid];
			this._createWorkers();
		});
		worker.on('message', ({cmd}) => {
			switch(cmd){
				case 'EADDRINUSE':
					this._logger.fatal({workerPid: pid}, 'fatal error');
					setImmediate(process.exit);
					break;
				default:
					break;
			}
		});
	}
}

exports.Master = Master;
