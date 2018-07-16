const {ObjectId} = require('mongodb');

const collectionName = 'specializations';

const {SpecializationCreateModel, SpecializationResponseModel} = require('../../models/specialization');

exports.getSpecializations = async function(filter, paginator){
};

exports.getSpecializationById =  async function(id){
	const collection = this.mongo.collection(collectionName);
	const [specialization] = await collection.find({_id: ObjectId(id)}).limit(1).toArray();
	return new SpecializationResponseModel(specialization || {});
};


exports.getSpecializationsWithPages = async function(filter, paginator) {
	const [doctors, pages] = await Promise.all([
		exports.getSpecializations(filter, paginator),
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


exports.saveSpecialization = async function(entity) {
	const collection = this.mongo.collection(collectionName);
	const doc = new SpecializationCreateModel(entity);
	await collection.insert(doc);
};

exports.getCount = async function(filter){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter);
};
