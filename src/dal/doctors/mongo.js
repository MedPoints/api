const collectionName = 'doctors';

const ObjectId = require('mongodb').ObjectId;

/**
 * @typedef {Object} Doctor -- doctor
 * @property {String} name -- fullname
 * @property {String} specialization -- specialization
 * @property {Array<Number>} ratings -- ratings of doctor
 */

 
 /**
  * @param {String} id -- doctor id
  * @returns {Promise<Doctor>}
  */
exports.getDoctorById = async function(id){
    return getDoctorByFilter.call(this, {_id: ObjectId(id)});
};

exports.getDoctors = async function(){
	const collection = this.mongo.collection(collectionName);
	return collection.find({}).toArray();
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
	await collection.insert(doctor);
};


/**
 *
 * @param {String} id
 * @param {Doctor} doctor
 */
exports.updateDoctor = async function(id, doctor){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: ObjectId(id)}, doctor);
};

/**
 * @param {String} id
 */
exports.deleteDoctor = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: ObjectId(id)});
};


/**
 * @param {String} id
 * @param {Number} score
 * @returns {Promise<void>}
 */
exports.changeRateOfDoctor = async function(id, score){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: ObjectId(id)}, {
		$push: {ratings: score}
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
