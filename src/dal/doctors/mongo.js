const collectionName = 'doctors';

/**
 * @typedef {Object} Doctor -- doctor
 * @property {String} name -- fullname
 */

 
 /**
  * @param {String} id -- doctor id
  * @returns {Promise<Doctor>}
  */
exports.getDoctorById = async function(id){
    getDoctorByFilter.call(this, {_id: id});
};

 /**
  * @param {String} name -- doctor full name
  * @returns {Promise<Doctor>}
  */
exports.getDoctorByName = async function(name){
    getDoctorByFilter.call(this, {name});
};

/**
 * @param {Object} filter
 * @return {Promise<Doctor>} 
 */
async function getDoctorByFilter(filter){
    const collection = this.mongo.collection(collectionName);
    const result = await collection.find(filter).limit(1).toArray();
    return result[0];
}
