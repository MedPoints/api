const Promise = require('bluebird');
const DoctorRate = require("../../models/rates").DoctorRate;
const {ObjectId} = require('mongodb');
const {DoctorCreate, DoctorResponse} = require("../../models/doctors");

const collectionName = 'doctors';

 /**
  * @param {String} id -- doctor id
  * @returns {Promise<DoctorResponse>}
  */
exports.getDoctorById = async function(id){
    return getDoctorByFilter.call(this, {_id: ObjectId(id)});
};

exports.getDoctors = async function(filter, paginator){
	const collection = this.mongo.collection(collectionName);
	let doctors = collection.find(filter);
	if(paginator){
		const offset = paginator.getOffset();
		doctors = doctors.skip(offset).limit(paginator.count);
	}
	doctors = await doctors.toArray();
	return doctors.map(d => new DoctorResponse(d));
};

exports.getDoctorsBySpecialization = async function(specialization, paginator) {
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
	const doctors = await collection.find({specialization}).skip(offset).limit(paginator.count).toArray();
	return doctors.map(d => new DoctorResponse(d));
};

exports.getDoctorsWithPages = async function(filter, paginator) {
	const [doctors, pages] = await Promise.all([
		exports.getDoctors(filter, paginator),
		exports.getCount(filter)
	]);
	return {
		data: doctors,
		meta: {
			pages: Math.ceil(pages / paginator.count),
			current: paginator.page,
		}
	}
};

exports.getCount = async function(filter={}){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter || {});
};

 /**
  * @param {String} name -- doctor full name
  * @returns {Promise<DoctorResponse>}
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
	const entity = new DoctorCreate(doctor);
	await collection.insert(entity);
};


/**
 *
 * @param {String} id
 * @param {DoctorResponse} doctor
 */
exports.updateDoctor = async function(id, doctor){
	const collection = this.mongo.collection(collectionName);
	delete doctor.id;
	await collection.update({_id: ObjectId(id)}, {$set: doctor});
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
 * @param {Object} rate
 * @returns {Promise<void>}
 */
exports.changeRateOfDoctor = async function(id, rate){
	const collection = this.mongo.collection(collectionName);
	const entity = new DoctorRate(rate);
	await collection.update({_id: ObjectId(id)}, {
		$push: {ratings: entity}
	});
};

/**
 * @param {Object} filter
 * @return {Promise<DoctorResponse>}
 */
async function getDoctorByFilter(filter){
    const collection = this.mongo.collection(collectionName);
    const result = await collection.find(filter).limit(1).toArray();
    return new DoctorResponse(result[0]);
}
