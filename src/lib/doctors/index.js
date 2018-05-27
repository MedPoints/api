const dal = require('../../dal/index');

const log = require('../../utils/logger').getLogger('DOCTORS');

/**
 * @param {String} id
 * @param {String} name
 * @returns {Promise<Doctor>}
 */
exports.getDoctor = async function({id, name}){
    const doctorDAL = await dal.open('doctors');
    try{
        if(id){
            return doctorDAL.getDoctorById(id);
        }else if(name){
            return doctorDAL.getDoctorByName(name);
        }else{
            throw new Error('EMPTY_PARAMS');
        }
    }catch(err){
        log.error({id, name}, 'getDoctor error', err);
        throw err;
    }finally{
        doctorDAL.close();
    }
};

/**
 * @param {Object} doctor
 * @returns {Promise<Void>} 
 */
exports.saveDoctor = async (doctor) => {
    const hospitalsDal = await dal.open('doctors');
    try{
        const model = buildDoctorModel(hospital);
        await hospitalsDal.saveHospital(model);
    }catch(err){
        log.error('saveHospital error', err);
        throw err;
    }finally{
        hospitalsDal.close()
    }
};

/**
 * @param {Object} doctor 
 */
function buildDoctorModel(doctor){
    const model = {};
    for(const key in hospital){
        switch(key){
            case '_id':
            case 'id':
                model._id = hospital[key];
                break;
            case 'name':
                model[key] = history[key];
                break;
            default:
                break;
        }
    }
}
