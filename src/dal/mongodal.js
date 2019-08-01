'use strict';

const {MongoClient} = require('mongodb');


class MongoDal {
	/**
	 * @param {Object} config
	 */
	constructor(config){
		this._config = {};
		this._initConfig(config);
		this._client = null;
		this._connectionCount = 0;
	}
	
	/**
	 * @returns {Promise<Db>}
	 */
	async createConnection(){
		if(!this._client){
			this._client = await MongoClient.connect(this._config.url, {});
		}
		this._connectionCount++;
		return this._client.db(this._config.dbName);
	}

	close(){
		this._connectionCount--;
		if(this._connectionCount === 0){
			this._client.close();
			this._client = null;
		} else if (this._connectionCount < 0){
			throw new Error('CONNECTION_ALREADY_CLOSED');
		}
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
