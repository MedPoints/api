const Promise = require('bluebird');
const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;
const LocationsResponse = require("../../routes/responses").LocationsResponse;

const log = require('../../utils/logger').getLogger('HOSPITALS');

const DOCTORS_DAL_NAME = 'doctors';
const HOSPITALS_DAL_NAME = 'hospitals';
const SPECIALIZATION_DAL_NAME = 'specializations';

/**
 *
 * @param {String} id
 * @param {String} name
 * @param {String} country
 * @param {String} specializationId
 * @param {String} service
 * @returns {Promise<ResponseWithMeta>}
 */
exports.getHospital = async ({id, name, country, specializationId, service}, paginator) => {
    const hospitalsDal = await dal.open(HOSPITALS_DAL_NAME);
    const doctorsDal = await dal.open(DOCTORS_DAL_NAME);
    const serviceDal = await dal.open('services');
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
        const filter = {};
        if(id){
            const hospital = await hospitalsDal.getHospitalById(id);
            return getCountOfServicesAndDoctors(hospital);
        }
        if(name){
	        filter.name = {$regex: name};
        }
        if(country){
            filter["location.country"] = country;
        }
        if(specializationId){
            filter["specializations.id"] = { $eq: specializationId};
        }
        if(service){
            const s = await serviceDal.getServiceById(service, true);
            let hospitalIds = s.providers && s.providers.hospitals || [];
        	filter._id = {$in: Array.from(hospitalIds).map(ObjectId)};
        }
        const result = await hospitalsDal.getHospitalsWithPages(filter, paginator) || {};
	    result.data = await Promise.map(result.data, getCountOfServicesAndDoctors);
        return new ResponseWithMeta(result);
    }catch(err){
        log.error({id, name}, 'getHospital error', err);
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
