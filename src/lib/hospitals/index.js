const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;
const LocationsResponse = require("../../routes/responses").LocationsResponse;

const log = require('../../utils/logger').getLogger('HOSPITALS');
const HOSPITALS_DAL_NAME = 'hospitals';

/**
 *
 * @param {String} id
 * @param {String} name
 * @returns {Promise<ResponseWithMeta>}
 */
exports.getHospital = async ({id, name}, paginator) => {
    const hospitalsDal = await dal.open(HOSPITALS_DAL_NAME);
    try{
        const filter = {};
        if(id){
            return hospitalsDal.getHospitalById(id);
        }
        if(name){
	        filter.name = {$regex: name};
        }
        const result = await hospitalsDal.getHospitalsWithPages(filter, paginator) || {};
        return new ResponseWithMeta(result);
    }catch(err){
        log.error({id, name}, 'getHospital error', err);
        throw err;
    }finally{
        hospitalsDal.close()
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

        return new LocationsResponse({worldsCount, groupedHospitals});
    }catch(err){
        log.error({id, name}, 'getHospitalLocations error', err);
        throw err;
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
