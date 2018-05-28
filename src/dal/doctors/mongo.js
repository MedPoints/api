const collectionName = 'doctors';

/**
 * @typedef {Object} Doctor -- doctor
 * @property {String} name -- fullname
 * @property {String} specialization -- specialization
 * @property {Number} ratings -- ratings of doctor
 */

 
 /**
  * @param {String} id -- doctor id
  * @returns {Promise<Doctor>}
  */
exports.getDoctorById = async function(id){
    return getDoctorByFilter.call(this, {_id: id});
};

 /**
  * @param {String} name -- doctor full name
  * @returns {Promise<Doctor>}
  */
exports.getDoctorByName = async function(name){
	return getDoctorByFilter.call(this, {name});
};

/**
 *
 * @param doctor
 * @returns {Promise<void>}
 */
exports.saveDoctor = async function(doctor){
	const collection = this.mongo.collection(collectionName);
	await collection.save(doctor);
};


/**
 *
 * @param {String} id
 * @param {Doctor} doctor
 */
exports.updateDoctor = async function(id, doctor){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: id}, doctor);
};

/**
 * @param {String} id
 */
exports.deleteDoctor = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id, id});
};


/**
 * @param {String} id
 * @param {Number} score
 * @returns {Promise<void>}
 */
exports.changeRateOfDoctor = async function(id, score){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: id}, {
		$push: {rate: score}
	});
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
