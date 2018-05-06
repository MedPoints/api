const MongoClient = require('mongodb').MongoClient;


class MongoDal {
	/**
	 * @param {Object} config
	 */
	constructor(config){
		this._config = {};
		this._initConfig(config);
		this._client = null;
	}
	
	/**
	 * @returns {Promise<Db>}
	 */
	async createConnection(){
		this._client = await MongoClient.connect(this._config.url, {});
		return this._client.db(this._config.dbName);
	}

	close(){
		this._client.close();
	}

	/**
	 * @param {Object} config
	 * @param {String} config.host
	 * @param {String} config.port
	 * @param {String} config.dbName
	 * @private
	 */
	_initConfig(config){
		this._config.url = `mongodb://${config.host}:${config.port}`;
		this._config.dbName = config.dbName;
	}
}

exports.dalType = MongoDal;
