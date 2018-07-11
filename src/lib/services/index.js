const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

const log = require('../../utils/logger').getLogger('SERVICES');


exports.getServices = async function({id, name}, paginator){
	const servicesDAL = await dal.open('services');
	try{
		if(id){
			return servicesDAL.getPharmacyById(id);
		}else if(name){
			return servicesDAL.getPharmacyByName(name);
		}
		const result = await servicesDAL.getServicesWithPages({}, paginator) || {};
		return new ResponseWithMeta(result)
	}catch(err){
		log.error({id, name}, 'getServices error', err);
		throw err;
	}finally{
		servicesDAL.close();
	}
};

exports.saveService = async function(service){
	const servicesDAL = await dal.open('services');
	try{
		await servicesDAL.saveService(service)
	}catch(err){
		log.error({id, name}, 'saveService error', err);
		throw err;
	}finally{
		servicesDAL.close();
	}
};

exports.updateService = async function(service){
	const servicesDAL = await dal.open('services');
	try{
		await servicesDAL.updateService(service.id, service);
	}
	catch(err){
		log.error({id, name}, 'updateService error', err);
		throw err;
	}finally{
		servicesDAL.close();
	}
};

exports.deleteService = async function(id){
	const servicesDAL = await dal.open('Services');
	try{
		await servicesDAL.deleteService(id);
	}catch(err){
		log.error({id, name}, 'deleteService error', err);
		throw err;
	}finally{
		servicesDAL.close();
	}
};
