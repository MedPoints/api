const fs = require('fs');
const path = require('path');

const Router = require('express').Router;

const logger = require('../utils/logger').getLogger('ROUTES');

const MODULE_MAIN_FILE = 'module.json';
const ALLOWED_METHODS = ['get', 'post', 'put', 'delete'];

/**
 * @returns {Router}
 */
exports.init = () => {
	const dir = path.join(__dirname, '/');
	const dirData = fs.readdirSync(dir);

	const modules = [];
	for(const source of dirData){
		if(fs.lstatSync(path.join(__dirname, source)).isDirectory()){
			modules.push(source);
		}
	}
	logger.debug(`founded ${modules.length} modules`);
	if(modules.length === 0){
		throw new Error('NO_MODULES_FOUNDED');
	}
	const router = Router();
	for(const module of modules){
		const moduleFile = path.join(__dirname, module, MODULE_MAIN_FILE);
		if(!fs.existsSync(moduleFile)){
			logger.warn({modulePath: moduleFile}, 'module file was not found');
			continue;
		}
		let moduleData;
		try{
			moduleData = JSON.parse(fs.readFileSync(moduleFile));
		}catch(err){
			logger.error(err);
			continue;
		}
		const loadedModule = require(`./${module}/index`);
		logger.debug({module: moduleData.name}, `start loading module`);
		const moduleMethods = Object.keys(loadedModule);
		for(const method of moduleMethods){
			if(ALLOWED_METHODS.indexOf(method) !== -1){
				let handler = loadedModule[method];
				if(typeof handler === 'function'){
					router[method](`/${moduleData.name}`, handler);
				}else if(typeof handler === 'object'){
					const additionalPath = handler.path;
					router[method](`/${moduleData.name}${additionalPath}`, handler.handler);
				}
				continue;
			}
			logger.error({method}, 'unknown method');
		}
		logger.debug({module: moduleData.name}, `module was loaded`);
	}
	return router;
};
