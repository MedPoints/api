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
    	let doctor;
        if(id){
            doctor = await doctorDAL.getDoctorById(id);
        }else if(name){
	        doctor = await doctorDAL.getDoctorByName(name);
        }else{
            const doctors = await doctorDAL.getDoctors() || [];
            return doctors.map(composeDoctorData);
        }
        if(!doctor){
        	return {};
        }
        return composeDoctorData(doctor);
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
    const doctorsDal = await dal.open('doctors');
    try{
        const model = buildDoctorModel(doctor);
        await doctorsDal.saveDoctor(model);
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
		const model = buildDoctorModel(doctor);
		await doctorsDal.updateDoctor(model._id, model);
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

exports.changeRateOfDoctor = async (id, score) => {
	const doctorsDal = await dal.open('doctors');
	try{
		await doctorsDal.changeRateOfDoctor(id, parseFloat(score));
	}catch(err){
		log.error('deleteDoctor error', err);
		throw err;
	}finally{
		doctorsDal.close();
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

function composeDoctorData(doctor) {
    doctor.rate = doctor.ratings.reduce((result, r) => result + r, 0);
    doctor.rate /= doctor.ratings.length;
    delete doctor.ratings;
    return doctor;
}
