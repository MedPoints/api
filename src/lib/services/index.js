const Promise = require('bluebird');
const ObjectId = require('mongodb').ObjectId;

const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

const log = require('../../utils/logger').getLogger('SERVICES');


exports.getServices = async function({id, name, hospital, doctor, filter}, paginator){
	const servicesDAL = await dal.open('services');
	const doctorsDAL = await dal.open('doctors');
	const hospitalDAL = await dal.open('hospitals');
	try{
		const query = {};
		if(id){
			return servicesDAL.getServiceById(id);
		}else if(name){
			query.name = {$regex: name};
		}
		if(hospital){
			const h = await hospitalDAL.getHospitalById(hospital);
			const doctors = await doctorsDAL.getDoctors({_id: {$in: h.doctors.map(doctor => new ObjectId(doctor))}}, null);
			const services = new Set();
			for(const doctor of doctors){
				for(const service of doctor.services){
					services.add(service.id);
				}
			}
			query._id = {$in: Array.from(services).map(id => new ObjectId(id))};
		}else if(filter){
			if(filter.city && filter.city !== 'worldwide'){
				const hospFilter = {};
				hospFilter['location.city'] = filter.city;
				const hospitals = await hospitalDAL.getHospitalsByCustomFilter(hospFilter) || [];
				if(hospitals.length === 0){
					return new ResponseWithMeta({
						data: [],
						meta: {
							pages: 0,
							current: paginator.page,
						}
					});
				}
				const doctorIds = hospitals.reduce((total, {doctors}) => {
					total.push(...doctors.map(doctor => new ObjectId(doctor)));
					return total;
				}, []);
				const doctors = await doctorsDAL.getDoctors({_id: {$in: doctorIds}}, null);
				const services = new Set();
				for(const doctor of doctors){
					for(const service of doctor.services){
						services.add(service.id);
					}
				}
				query._id = {$in: Array.from(services).map(id => new ObjectId(id))};
			}
			if(filter.insurance){
				query['is_covered_by_insurance'] = filter.insurance === 'on';
			}
			if(filter.maxPrice){
				const maxPrice = Number(filter.maxPrice);
				query['price.mpts'] = {$lte: maxPrice};
			}
		}
		const result = await servicesDAL.getServicesWithPages(query, paginator) || {};
		if (!(result && result.data && result.data.length > 0)) {
			return new ResponseWithMeta(result);
		}
		await Promise.each(result.data, async (service) => {
			const doctors = await doctorsDAL.getDoctors({services: service.id.toString()});
			service.providers.doctors = doctors;
		});
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
