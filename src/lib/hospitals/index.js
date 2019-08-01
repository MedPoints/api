'use strict'

const ObjectId = require('mongodb').ObjectId;
const Promise = require('bluebird');
const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;
const LocationsResponse = require("../../routes/responses").LocationsResponse;

const log = require('../../utils/logger').getLogger('HOSPITALS');

const DOCTORS_DAL_NAME = 'doctors';
const HOSPITALS_DAL_NAME = 'hospitals';

/**
 *
 * @param {String} id
 * @param {String} name
 * @param {String} country
 * @param {String} specializationId
 * @param {String} service
 * @param {Object} filter
 * @returns {Promise<ResponseWithMeta>}
 */
exports.getHospital = async ({id, name, country, specializationId, service, filter}, paginator) => {
    const [
        hospitalsDal,
        doctorsDal,
        serviceDal
    ] = await Promise.all([dal.open(HOSPITALS_DAL_NAME), dal.open(DOCTORS_DAL_NAME), dal.open('services')]);
	const getCountOfServicesAndDoctors = async (hospital) => {
		const services = new Set();
		await Promise.each(hospital.doctors, async (id) => {
			const doctor = await doctorsDal.getDoctorById(id);
			for(const service of doctor.services){
				services.add(service);
			}
		});
		
		hospital.services = services.size;
		hospital.doctors = hospital.doctors.length;
		return hospital;
	};
    try{
        const query = {};
        if(id){
            const hospital = await hospitalsDal.getHospitalById(id);
            return await getCountOfServicesAndDoctors(hospital);
        }
        if(name){
	        query.name = {$regex: name, $options: 'i'};
        }
        if(country){
            query['location.country'] = country;
        }
        if(specializationId){
            query['specializations.id'] = { $eq: specializationId};
        }
        if(filter){
            if(filter.city && filter.city !== 'worldwide'){
	            query['location.city'] = filter.city;
            }
        }
        if(service){
            const hospitals = new Set();
            const doctors = await doctorsDal.getDoctors({services: service});
            doctors.forEach(({hospital}) => hospitals.add(hospital.id));
        	query._id = {$in: Array.from(hospitals).map(id => new ObjectId(id))};
        }
        const result = await hospitalsDal.getHospitalsWithPages(query, paginator) || {};
	    result.data = await Promise.map(result.data, getCountOfServicesAndDoctors);
        return new ResponseWithMeta(result);
    }catch(err){
        log.error({id, name, err}, 'getHospital error');
        throw err;
    }finally{
    	doctorsDal.close();
        hospitalsDal.close();
	    serviceDal.close();
    }
};

/**
 *
 * @returns {Promise<LocationsResponse>}
 */
exports.getHospitalsLocations = async () => {
    const hospitalsDal = await dal.open(HOSPITALS_DAL_NAME);
    try{
        const [worldsCount, groupedHospitals] = await Promise.all([
            hospitalsDal.getCount(),
            hospitalsDal.getHospitalsGroupedByLocation()
        ]);
        return new LocationsResponse({ worldsCount : worldsCount, locations : groupedHospitals});
    }catch(err){
        log.error('getHospitalLocations error', err);
        throw err
    }finally{
        hospitalsDal.close();
    }
};


/**
 * @param {Object} hospital
 * @returns {Promise<Void>}
 */
exports.saveHospital = async (hospital) => {
    const hospitalsDal = await dal.open(HOSPITALS_DAL_NAME);
    try{
        await hospitalsDal.saveHospital(hospital);
    }catch(err){
        log.error('saveHospital error', err);
        throw err;
    }finally{
        hospitalsDal.close()
    }
};

/**
 * @param {Object} hospital
 * @returns {Promise}
 */
exports.updateHospital = async (hospital) => {
    const hospitalsDal = await dal.open(HOSPITALS_DAL_NAME);
    try{
        const model = buildHospitalModel(hospital);
        await hospitalsDal.updateHospital(model._id, model);
    }catch(err){
        log.error('updateHospital error', err);
        throw err;
    }finally{
        hospitalsDal.close()
    }
};

exports.getCount = async function(filter = {}) {
	const hospitalsDal = await dal.open(HOSPITALS_DAL_NAME);
	try{
		return hospitalsDal.getCount(filter);
	}catch(err){
		log.error({}, 'getCount error', err);
		throw err;
	}finally{
		hospitalsDal.close();
	}
};

/**
 * @param {String} id
 * @returns {Promise<Void>}
 */
exports.deleteHospital = async (id) => {
    const hospitalsDal = await dal.open(HOSPITALS_DAL_NAME);
    try{
        await hospitalsDal.deleteHospital(id);
    }catch(err){
        log.err('deleteHospital error', err);
        throw err;
    }finally{
        hospitalsDal.close();
    }
};

/**
 * @param {Object} hospital
 * @returns {Hospital}
 */
function buildHospitalModel(hospital){
    const model = {};
    for(const key in hospital){
        switch(key){
            case '_id':
            case 'id':
                model._id = hospital[key];
                break;
            case 'name':
            case 'specialization':
            case 'chain':
            case 'type':
            case 'email':
            case 'phone':
            case 'website':
            case 'departments':
                model[key] = hospital[key];
                break;
            case 'coordinations':
                if(typeof hospital[key] === 'object'){
                    const coord = hospital[key];
                    if(!coord.lat || !coord.lon){
                        log.warning({coord}, 'wrong schema of coordination');
                    }
                    model[key] = coord;
                }else{
                    log.warning({coord}, 'wrong schema of coordination');
                }
                break;
            case 'photos':
            case 'doctors':
                if(!Array.isArray(hospital[key])){
                    log.warning({key}, 'wrong schema');
                }else{
                    model[key] = hospital[key];
                }
                break;
                break;
            default:
                break;
        }
    }
    return model;
}
