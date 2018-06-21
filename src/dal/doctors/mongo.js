const collectionName = 'doctors';

const ObjectId = require('mongodb').ObjectId;


 /**
  * @param {String} id -- doctor id
  * @returns {Promise<DoctorResponse>}
  */
exports.getDoctorById = async function(id){
    return getDoctorByFilter.call(this, {_id: ObjectId(id)});
};

exports.getDoctors = async function(){
	const collection = this.mongo.collection(collectionName);
	const doctors = await collection.find({}).toArray();
	return doctors.map(d => new DoctorResponse(d));
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
	const entity = new Rate(rate);
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

class BaseDoctorModel {
	constructor({name, specialization, ratings}) {
		this.name = name;
		this.specialization = specialization || '';
		this.ratings = ratings || [];
	}
}

class DoctorCreate extends BaseDoctorModel {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity._id || entity.id);
	}
}

class DoctorResponse extends BaseDoctorModel {
	constructor(entity) {
		super(entity);
		this.id = entity._id || entity.id;
		this.rate = this.ratings.reduce((result, r) => result + r.rate, 0);
		if (this.ratings.length > 0) {
			this.rate /= this.ratings.length;
			this.rate = Math.floor(this.rate);
		}
	}
}

class Rate {
	constructor({userId, rate, comment, commonRate}) {
		this.userId = userId;
		this.rate = Math.min(rate || 0, 10);
		this.comment = comment;
		this.commonRate = new CommonRate(commonRate || {});
		this.dateCreated = new Date();
	}
}

class CommonRate {
	constructor({knowledge, skills, attention, priceQuality}) {
		this.knowledge = Math.min(knowledge || 0);
		this.skills = Math.min(skills || 0);
		this.attention = Math.min(attention || 0);
		this.priceQuality = Math.min(priceQuality || 0);
	}
}
