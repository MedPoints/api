const fs = require('fs');
const config = require('config');
const path = require('path');

const utils = require('../utils/logger');

const logger = utils.getLogger('DAL');

const ENTITIES = 'entities.json';

const dalTypes = {
	mongo: require('./mongodal').dalType
};

const DALS = {};

exports.initDAL = function(){
	const pathToFile = path.join(__dirname, ENTITIES);
	logger.debug('start loading dals');
	let entities;
	try{
		entities = JSON.parse(fs.readFileSync(pathToFile));
	}catch(err){
		logger.error('error while loading dal', err);
		throw err;
	}
	const keys = Object.keys(entities);
	for(const entity of keys){
		logger.debug(`load entity ${entity}`);
		const scopes = Object.keys(entities[entity]);
		for(const scope of scopes){
			DALS[entity] = wrapDALMethods(entity, scope);
		}
	}
};

function wrapDALMethods(entity, type){
	const module = require(`./${entity}/${type}`);
	if(!module){
		throw new Error('MODULE_NOT_FOUND');
	}
	const dalType = dalTypes[type];
	if(!dalType){
		throw new Error('UNSUPPORTED_INTERFACE');
	}
	const cfg = config.get(type);
	const connectionInterface = new dalType(cfg || {});
	module.open = async function(){
		this[type] = await connectionInterface.createConnection();
		return this;
	};
	module.close = function(){
		connectionInterface.close();
	};
	return module;
}

exports.open = async function(name){
	const dal = DALS[name];
	if(!dal){
		throw new Error('NOT_EXISTS_DAL');
	}
	return dal.open();
};
