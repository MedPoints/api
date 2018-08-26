const Promise = require('bluebird');
const ObjectId = require('mongodb').ObjectId;
const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

const log = require('../../utils/logger').getLogger('DOCTORS');

/**
 * @param {String} id
 * @param {String} name
 * @param {String} specializations
 * @param {Paginator} paginator
 * @returns {Promise<DoctorResponse|Array<DoctorResponse>|Object>}
 */
exports.getDoctor = async function({id, name, specialization, service, hospital}, paginator){
    const doctorDAL = await dal.open('doctors');
    const hospitalDAL = await dal.open('hospitals');
    try{
    	const filter = {};
        if(id){
            return doctorDAL.getDoctorById(id);
        }
        if(hospital){
        	const hosp = await hospitalDAL.getHospitalById(hospital) || {};
        	if(!hosp){
        		return new ResponseWithMeta({
			        data: [],
			        meta: {
				        pages: 0,
				        current: paginator.page,
			        }
		        });
	        }
        	filter._id = {$in: hosp.doctors.map(ObjectId)};
        }
        else if(name){
        	filter.name = {$regex: name};
        }else if(specialization){
        	filter.specialization = specialization;
        }else if(service){
        	filter.services = service;
        }
	    const result = await doctorDAL.getDoctorsWithPages(filter, paginator) || {};
	    return new ResponseWithMeta(result)
    }catch(err){
        log.error({id, name}, 'getDoctor error', err);
        throw err;
    }finally{
        doctorDAL.close();
        hospitalDAL.close();
    }
};

exports.getServicesByDoctorId = async function(id){
	const doctorDAL = await dal.open('doctors');
	const servicesDAL = await dal.open('services');
	try{
		const doctor = await doctorDAL.getDoctorById(id);
		if(!doctor){
			return [];
		}
		const serviceIds = doctor.services || [];
		const result = await Promise.map(serviceIds, async (serviceId) => servicesDAL.getServiceById(serviceId));
		return result;
	}finally{
		doctorDAL.close();
		servicesDAL.close();
	}
};

exports.getHospitalsByDoctor = async function({id, service}){
	const hospitalDAL = await dal.open('hospitals');
	try{
		const filter = {
			$and: [
				{services: service},
				{doctors: id}
			]
		};
		const hospitals = await hospitalDAL.getHospitalsByCustomFilter(filter);
		return hospitals;
	}finally{
		hospitalDAL.close();
	}
};

/**
 * @param {Object} doctor
 * @returns {Promise}
 */
exports.saveDoctor = async (doctor) => {
    const doctorsDal = await dal.open('doctors');
    try{
        await doctorsDal.saveDoctor(doctor);
    }catch(err){
        log.error('saveDoctor error', err);
        throw err;
    }finally{
        doctorsDal.close()
    }
};

exports.updateDoctor = async (doctor) => {
	const doctorsDal = await dal.open('doctors');
	try{
		await doctorsDal.updateDoctor(doctor.id, doctor);
	}catch(err){
		log.error('updateDoctor error', err);
		throw err;
	}finally{
		doctorsDal.close();
	}
};

exports.deleteDoctor = async (id) => {
	const doctorsDal = await dal.open('doctors');
	try{
		await doctorsDal.deleteDoctor(id);
	}catch(err){
		log.error('deleteDoctor error', err);
		throw err;
	}finally{
		doctorsDal.close();
	}
};

exports.getCount = async (filter = {}) => {
	const doctorsDal = await dal.open('doctors');
	try{
		return doctorsDal.getCount(filter);
	}catch(err){
		log.error('getCount error', err);
		throw err;
	}finally{
		doctorsDal.close();
	}
};

exports.changeRateOfDoctor = async (id, rate) => {
	const doctorsDal = await dal.open('doctors');
	try{
		await doctorsDal.changeRateOfDoctor(id, rate);
	}catch(err){
		log.error('changeRateOfDoctor error', err);
		throw err;
	}finally{
		doctorsDal.close();
	}
};
