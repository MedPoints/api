const collectionName = 'pharmacies';

const ObjectId = require('mongodb').ObjectId;

const {PharmaciesCreate, PharmaciesResponse} = require('../../models/pharmacies');
const {PharmacyRate} = require('../../models/rates');

exports.getPharmacyById = async function(id){
	return pharmaciesQuery.call(this, {_id: ObjectId(id)});
};


exports.getPharmacyByName = async function(name){
	return pharmaciesQuery.call(this, {name});
};

exports.getAllPharmaciesWithoutPages = async function(filter){
    const collection = this.mongo.collection(collectionName);
    const result = await collection.find(filter).toArray();
    return result.map(r => new PharmaciesResponse(r));
};

exports.getAllPharmacies = async function(filter, paginator){
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
	const result = await collection.find(filter).skip(offset).limit(paginator.count).toArray();
	return result.map(r => new PharmaciesResponse(r));
};

exports.getPharmaciesWithPages = async function(filter, paginator) {
	const [pharmacies, total] = await Promise.all([
		exports.getAllPharmacies(filter, paginator),
		exports.getCount(filter)
	]);
	return {
		data: pharmacies,
		meta: {
			pages: Math.ceil(total / paginator.count),
			current: paginator.page,
			total,
		}
	}
};

exports.savePharmacy = async function(pharmacy){
	const collection = this.mongo.collection(collectionName);
	const entity = new PharmaciesCreate(pharmacy);
	await collection.insert(entity);
};

exports.getCount = async function(filter={}){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter || {});
};

exports.updatePharmacy = async function(id, pharmacy){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: ObjectId(id)}, pharmacy);
};

exports.deletePharmacy = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: new ObjectId(id)});
};

exports.changeRateOfPharmacy = async function(id, rate){
	const collection = this.mongo.collection(collectionName);
	const entity = new PharmacyRate(rate);
	await collection.update({_id: new ObjectId(id)}, {
		$push: {ratings: entity}
	});
};

async function pharmaciesQuery(filter){
	const collection = this.mongo.collection(collectionName);
	const [pharmacy] = await collection.find(filter).limit(1).toArray();
	return new PharmaciesResponse(pharmacy || {});
}

