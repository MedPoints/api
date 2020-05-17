const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;

const log = require('../../utils/logger').getLogger('DRUGS_GROUPS');


exports.getAllGroups = async function({name}, paginator){
	const groupsDal = await dal.open('groups');
	try{
		const filter = {};
		if(name) {
			filter.name = name;
		}
		const result = await groupsDal.getGroupsWithPages(filter, paginator);
		return new ResponseWithMeta(result);
	}catch(err){
		log.error({id, name}, 'getAllGroups error', err);
		throw err;
	}finally{
		groupsDal.close();
	}
};

exports.getGroup = async function({id}){
	const groupsDal = await dal.open('groups');
	try{
		return groupsDal.getCategoryById(id);
	}catch(err){
		log.error({id, name}, 'getGroup error', err);
		throw err;
	}finally{
		groupsDal.close();
	}
};

exports.saveGroup = async function(entity){
	const groupsDal = await dal.open('groups');
	try{
		return groupsDal.saveCategory(entity);
	}catch(err){
		log.error({id, name}, 'saveGroup error', err);
		throw err;
	}finally{
		groupsDal.close();
	}
};

exports.updateGroup = async function(entity){
	const groupsDal = await dal.open('groups');
	try{
		await groupsDal.updateCategory(entity.id, entity);
	}catch(err){
		log.error({id, name}, 'updateGroup error', err);
		throw err;
	}finally{
		groupsDal.close();
	}
};

exports.deleteGroup = async function(id){
	const groupsDal = await dal.open('groups');
	try{
		await groupsDal.deleteGroup(id);
	}catch(err){
		log.error('groupsDal error', err);
		throw err;
	}finally{
		groupsDal.close();
	}
};
