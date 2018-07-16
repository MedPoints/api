const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;

const log = require('../../utils/logger').getLogger('DRUGS');

exports.getDrugs = async ({name, id, groupId}, paginator) => {
	const drugsDal = await dal.open('drugs');
	try{
		if(id){
			return drugsDal.getDrugById(id);
		}
		const filter = {};
		if (groupId) {
			filter['group.id'] =  groupId;
		}else if(name) {
			filter.name = name;
		}
		const result = await drugsDal.getDrugsWithPages(filter, paginator);
		return new ResponseWithMeta(result);
	}catch(err){
		log.error('getDrugs error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};

exports.saveDrug = async function(entity){
	const drugsDal = await dal.open('drugs');
	try{
		return drugsDal.saveDrug(entity);
	}catch(err){
		log.error({}, 'saveDrug error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};

exports.getCount = async function(filter = {}) {
	const drugsDal = await dal.open('drugs');
	try{
		return drugsDal.getCount(filter);
	}catch(err){
		log.error({}, 'getCount error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};

exports.updateDrug = async function(entity){
	const drugsDal = await dal.open('drugs');
	try{
		return drugsDal.updateDrug(entity.id, entity);
	}catch(err){
		log.error({}, 'updateDrug error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};
