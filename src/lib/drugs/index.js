const dal = require('../../dal/index');

const log = require('../../utils/logger').getLogger('DRUGS');

exports.getCategory = async ({id, name}) => {
	const drugsDal = await dal.open('drugs');
	try{
		if(id){
			return drugsDal.getCategoryById(id);
		}
		return drugsDal.getCategoryByName(name);
	}catch(err){
		log.error('getCategory error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};

exports.getAllCategories = async () => {
	const drugsDal = await dal.open('drugs');
	try{
		return drugsDal.getAllCategories();
	}catch(err){
		log.error('getAllCategories error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};
