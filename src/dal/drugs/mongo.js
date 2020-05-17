const collectionName = 'drugs';

const ObjectId = require('mongodb').ObjectId;

const {DrugModelCreate, DrugModelResponse} = require('../../models/drug');

exports.getAllDrugs = async function(filter, paginator){
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
	const result = await collection.find(filter).skip(offset).limit(paginator.count).toArray();
	return result.map(c => new DrugModelResponse(c));
};

exports.getDrugById = async function(id){
	return exports.getDrugByFilter({_id: ObjectId(id)});
};

exports.saveDrug = async function(drug){
	const collection = this.mongo.collection(collectionName);
	const entity = new DrugModelCreate(drug);
	entity.timestamp = drug.timestamp;
	await collection.insert(entity);
	return entity;
};

exports.updateDrug = async function(id, drug){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: ObjectId(id)}, drug);
};

exports.deleteDrug = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: new ObjectId(id)});
};

exports.getDrugByFilter = async function(filter){
	const collection = this.mongo.collection(collectionName);
	const [result] = await collection.find(filter).limit(1).toArray();
	if (!result) {
		return null;
	}
	return new DrugModelResponse(result || {});
};

exports.getCount = async function(filter={}){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter || {});
};

exports.getDrugsWithPages = async function(filter, paginator) {
    if(filter.ids){
        filter._id = {
        	$in : filter.ids.map(id => new ObjectId(id))
        };
        delete filter.ids;
    }

	const [doctors, total] = await Promise.all([
		exports.getAllDrugs(filter, paginator),
		exports.getCount(filter)
	]);
	return {
		data: doctors,
		meta: {
			pages: Math.ceil(total / paginator.count),
			current: paginator.page,
			total,
		}
	}
};

