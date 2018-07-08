const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

const log = require('../../utils/logger').getLogger('DOCTORS');

/**
 * @param {String} id
 * @param {String} name
 * @param {String} specializations
 * @param {Paginator} paginators
 * @returns {Promise<DoctorResponse|Array<DoctorResponse>|Object>}
 */
exports.getDoctor = async function({id, name, specialization}, paginator){
    const doctorDAL = await dal.open('doctors');
    try{
        if(id){
            return doctorDAL.getDoctorById(id);
        }else if(name){
	        return doctorDAL.getDoctorByName(name);
        }else if(specialization){
        	const result = await doctorDAL.getDoctorsWithPages({specialization}, paginator) || {};
        	return new ResponseWithMeta(result)
        }
	    const result = await doctorDAL.getDoctorsWithPages({}, paginator) || {};
	    return new ResponseWithMeta(result)
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

exports.changeRateOfDoctor = async (id, rate) => {
	const doctorsDal = await dal.open('doctors');
	try{
		await doctorsDal.changeRateOfDoctor(id, rate);
	}catch(err){
		log.error('deleteDoctor error', err);
		throw err;
	}finally{
		doctorsDal.close();
	}
};
