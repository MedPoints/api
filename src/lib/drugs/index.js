const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;

const log = require('../../utils/logger').getLogger('DRUGS');

exports.getDrugs = async ({name, id}, paginator) => {
	const drugsDal = await dal.open('drugs');
	try{
		if(id){
			return drugsDal.getDrugById(id);
		}
		const filter = {};
		if(name) {
			filter.name = name;
		}
		const result = await drugsDal.getDrugsWithPages(filter, paginator);
		return new ResponseWithMeta(result);
	}catch(err){
		log.error('getCategory error', err);
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
		log.error({}, 'saveGroup error', err);
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
