const ObjectId = require('mongodb').ObjectId;

const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

const log = require('../../utils/logger').getLogger('SERVICES');


exports.getServices = async function({id, name, hospital, doctor}, paginator){
	const servicesDAL = await dal.open('services');
	const doctorsDAL = await dal.open('doctors');
	const hospitalDAL = await dal.open('hospitals');
	try{
		if(id){
			return servicesDAL.getServiceById(id);
		}else if(name){
			return servicesDAL.getServiceByName(name);
		}
		const filter = {};
		if(hospital){
			const h = await hospitalDAL.getHospitalById(hospital);
			const doctors = await doctorsDAL.getDoctors({_id: {$in: h.doctors.map(ObjectId)}}, null);
			const services = new Set();
			for(const doctor of doctors){
				for(const service of doctor.services){
					services.add(service.id);
				}
			}
			filter._id = {$in: Array.from(services).map(id => new ObjectId(id))};
		}
		const result = await servicesDAL.getServicesWithPages(filter, paginator) || {};
		return new ResponseWithMeta(result)
	}catch(err){
		log.error({id, name}, 'getServices error', err);
		throw err;
	}finally{
		doctorsDAL.close();
		hospitalDAL.close();
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

exports.getCount = async function(filter = {}) {
	const servicesDAL = await dal.open('services');
	try{
		return servicesDAL.getCount(filter);
	}catch(err){
		log.error({}, 'getCount error', err);
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
