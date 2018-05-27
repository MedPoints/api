const contextWrapper = require('../../utils/utils').contextWrapper;

const log = require('../../utils/logger').getLogger('DOCTORS');

/**
 * @param {String} id
 * @param {String} name
 * @returns {Promise<Doctor>}
 */
exports.getDoctor = contextWrapper(async function({id, name}){
    const doctorDAL = await this.getDAL('doctors');
    if(id){
        return doctorDAL.getDoctorById(id);
    }else if(name){
        return doctorDAL.getDoctorByName(name);
    }else{
        throw new Error('EMPTY_PARAMS');
    }
});
