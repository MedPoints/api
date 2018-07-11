const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

const log = require('../../utils/logger').getLogger('PHARMACIES');


exports.getPharmacies = async function({id, name}, paginator){
	const pharmaciesDAL = await dal.open('pharmacies');
	try{
		if(id){
			return pharmaciesDAL.getPharmacyById(id);
		}else if(name){
			return pharmaciesDAL.getPharmacyByName(name);
		}
		const result = await pharmaciesDAL.getPharmaciesWithPages({}, paginator) || {};
		return new ResponseWithMeta(result)
	}catch(err){
		log.error({id, name}, 'getPharmacies error', err);
		throw err;
	}finally{
		pharmaciesDAL.close();
	}
};

exports.savePharmacy = async function(pharmacy){
	const pharmaciesDAL = await dal.open('pharmacies');
	try{
		await pharmaciesDAL.savePharmacy(pharmacy)
	}catch(err){
		log.error({id, name}, 'savePharmacy error', err);
		throw err;
	}finally{
		pharmaciesDAL.close();
	}
};

exports.updatePharmacy = async function(pharmacy){
	const pharmaciesDAL = await dal.open('pharmacies');
	try{
		await pharmaciesDAL.updatePharmacy(pharmacy.id, pharmacy);
	}
	catch(err){
		log.error({id, name}, 'updatePharmacy error', err);
		throw err;
	}finally{
		pharmaciesDAL.close();
	}
};

exports.deletePharmacy = async function(id){
	const pharmaciesDAL = await dal.open('pharmacies');
	try{
		await pharmaciesDAL.deletePharmacy(id);
	}catch(err){
		log.error({id, name}, 'deletePharmacy error', err);
		throw err;
	}finally{
		pharmaciesDAL.close();
	}
};