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
 * @returns {Promise}
 */
exports.saveDoctor = async (doctor) => {
    const hospitalsDal = await dal.open('doctors');
    try{
        const model = buildDoctorModel(doctor);
        await hospitalsDal.saveDoctor(model);
    }catch(err){
        log.error('saveHospital error', err);
        throw err;
    }finally{
        hospitalsDal.close()
    }
};

/**
 * @param {Object} doctor
 * @returns {Doctor}
 */
function buildDoctorModel(doctor){
    const model = {};
    for(const key in doctor){
        switch(key){
            case '_id':
            case 'id':
                model._id = doctor[key];
                break;
            case 'name':
            case 'specialization':
                model[key] = doctor[key];
                break;
            case 'ratings':
	            if(!Array.isArray(doctor[key])){
		            log.warning({key}, 'wrong schema');
	            }else{
		            model[key] = doctor[key];
	            }
                break;
            default:
                break;
        }
    }
}
