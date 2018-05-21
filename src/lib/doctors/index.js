const contextWrappers = require('../../utils/utils').contextWrappers;

const log = require('../utils/logger').getLogger('DOCTORS');

/**
 * @param {String} id
 * @param {String} name
 * @returns {Promise}
 */
exports.getDoctor = contextWrappers(async function({id, name}){
    const doctorDAL = await this.getDAL('doctors');
});
