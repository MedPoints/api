const collectionName = 'hospitals';

const ObjectId = require('mongodb').ObjectId;
const {HospitalResponse, HospitalCreate} = require("../../models/hospitals");

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
 * @returns {Promise<HospitalResponse>}
 */
exports.getHospitalById = async function(id){
    const result = await hospitalQuery.call(this, {_id: ObjectId(id)});
    return new HospitalResponse(result);
};

/**
 * @param {String} name
 * @return {Promise<HospitalResponse>}
 */
exports.getHospitalByName = async function(name){
    const result = await hospitalQuery.call(this, {name});
    if (!result) {
        return null;
    }
    return new HospitalResponse(result);
};

exports.getHospitalsByCustomFilter = async function(filter){
	const collection = this.mongo.collection(collectionName);
	const result = await collection.find(filter).toArray();
	return result.map(r => new HospitalResponse(r));
};

exports.getAllHospitals = async function(filter, paginator) {
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
    const result = await collection.find(filter).skip(offset).limit(paginator.count).toArray();
    return result.map(r => new HospitalResponse(r));
};

exports.getHospitalsWithPages = async function(filter, paginator) {
    const [hospitals, pages] = await Promise.all([
		exports.getAllHospitals(filter, paginator),
		exports.getCount(filter)
	]);
	return {
		data: hospitals,
		meta: {
			pages: Math.ceil(pages / paginator.count)
		}
	}
};

exports.getHospitalsGroupedByLocation= async () => {
    const collection = this.mongo.collection(collectionName);
    const result = await collection.aggregate([
        {
            $group: {
                _id: "$location.country",
                count: {$sum: 1},
                hospitals: {
                    "$push": {
                        id: {$toString: "$_id"},
                        name: "$name",
                        address: "$location.address",
                        coordinations: "$coordinations"
                    }
                }
            }
        },
        {$project: {_id: 0, name: "$_id", count: 1, hospitals: 1}}
    ]).toArray();
    return result;
};

exports.getCount = async function(filter={}){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter || {});
};

/**
 * @param {Object} hospital
 */
exports.saveHospital = async function(hospital){
    const collection = this.mongo.collection(collectionName);
    const entity = new HospitalCreate(hospital);
    await collection.insert(entity);
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
