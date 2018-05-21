const dal = require('../../dal/index');

const log = require('../utils/logger').getLogger('HOSPITALS');

/**
 * 
 * @param {String} id
 * @param {String} name
 * @returns {Promise<Hospital>} 
 */
exports.getHospital = async ({id, name}) => {
    const hospitalsDal = await dal.open('hospitals');
    try{
        if(id){
            return hospitalsDal.getHospitalById(id);
        }else if(name){
            return hospitalsDal.getHospitalByName(name);
        }else{
            throw new Error('EMPTY_PARAMS');
        }
    }catch(err){
        log.error({id, name}, 'getHospital error', err);
        throw err;
    }finally{
        hospitalsDal.close()
    }
};


/**
 * @param {Object} hospital
 * @returns {Promise<Void>} 
 */
exports.saveHospital = async (hospital) => {
    const hospitalsDal = await dal.open('hospitals');
    try{
        const model = buildHospitalModel(hospital);
        await hospitalsDal.saveHospital(model);
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
    const hospitalsDal = await dal.open('hospitals');
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

/**
 * @param {String} id 
 * @returns {Promise<Void>}
 */
exports.deleteHospital = async (id) => {
    const hospitalsDal = await dal.open('hospitals');
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
            case 'doctors':
                if(!Array.isArray(hospital[key])){
                    log.warning({coord}, 'wrong schema of doctors');
                }else{
                    model[key] = hospital[key];
                }
                break;
            default:
                break;
        }
    }
    return model;
}
