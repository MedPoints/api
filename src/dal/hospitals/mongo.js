const collectionName = 'hospitals';

const ObjectId = require('mongodb').ObjectId;

/**
 * @typedef {Object} OpeningHours -- opening hours model
 * @property {String} dayOfWeek -- day of week
 * @property {Boolean} isClosed -- is closed today
 * @property {String} open -- time of opening
 * @property {String} closed -- time of closing
 */

/**
 * @typedef {Object} Coordinations -- coordination model
 * @property {Number} lat
 * @property {Number} lon
 */

/**
 * @typedef {Object} Hospital -- hospital model
 * @property {String} _id
 * @property {String} name -- hospital name
 * @property {String} chain -- chain of hospital
 * @property {Array<String>} departments -- departments of hospitals
 * @property {String} specialiazion -- hospital specialization
 * @property {Coordinations} coordinations -- hospital coordinations
 * @property {String} address -- hospital address
 * @property {Array<String>} photos -- links for photos
 * @property {Array<OpeningHours>} openingHours
 * @property {String} email
 * @property {String} phone
 * @property {String} website
 * @property {Array<Doctor>} doctors
 */

/**
 * @param {String} id
 * @returns {Promise<Hospital>}
 */
exports.getHospitalById = async function(id){
    return hospitalQuery.call(this, {_id: ObjectId(id)});
};

/**
 * @param {String} name
 * @return {Promise<Hospital>}
 */
exports.getHospitalByName = async function(name){
    return hospitalQuery.call(this, {name});
};

exports.getAllHospitals = async function() {
	const collection = this.mongo.collection(collectionName);
	return collection.find(filter).toArray();
};

/**
 * @param {Hospital} hospital
 */
exports.saveHospital = async function(hospital){
    const collection = this.mongo.collection(collectionName);
    await collection.insert(hospital);
};

/**
 *
 * @param {String} id
 * @param {Hospital} hospital
 */
exports.updateHospital = async function(id, hospital){
    const collection = this.mongo.collection(collectionName);
    await collection.update({_id: ObjectId(id)}, hospital);
};


/**
 * @param {String} id
 */
exports.deleteHospital = async function(id){
    const collection = this.mongo.collection(collectionName);
    await collection.remove({_id: ObjectId(id)});
};

/**
 * @param {Object} filter
 * @returns {Promise<Hospital>}
 */
async function hospitalQuery(filter){
    const collection = this.mongo.collection(collectionName);
    const hospitals = await collection.find(filter).limit(1).toArray();
    return hospitals[0];
}
