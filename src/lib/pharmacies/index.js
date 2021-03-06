'use strict';

const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

const log = require('../../utils/logger').getLogger('PHARMACIES');


exports.getPharmacies = async function({id, name, drugId, filter}, paginator){
	const pharmaciesDAL = await dal.open('pharmacies');
	try{
		let query = {};
		if(id){
			return await pharmaciesDAL.getPharmacyById(id);
		}else if(name){
			query.name = {$regex: name, $options: 'i'};
		}
		if(drugId){
			query.drugs = drugId;
		}
		if(filter){
			if(filter.city && filter.city !== 'worldwide'){
				query['location.city'] = filter.city;
			}
		}
		const result = await pharmaciesDAL.getPharmaciesWithPages(query, paginator) || {};
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

exports.getCount = async function(filter = {}) {
	const pharmaciesDal = await dal.open('pharmacies');
	try{
		return pharmaciesDal.getCount(filter);
	}catch(err){
		log.error({}, 'getCount error', err);
		throw err;
	}finally{
		pharmaciesDal.close();
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

exports.changeRateOfPharmacy = async function(id, rate){
	const pharmacyDal = await dal.open('pharmacies');
	try{
		await pharmacyDal.changeRateOfPharmacy(id, rate);
	}catch(err){
		log.error('changeRateOfPharmacy error', err);
		throw err;
	}finally{
		pharmacyDal.close();
	}
};
