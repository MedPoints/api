const collectionName = 'services';

const ObjectId = require('mongodb').ObjectId;

const {ServicesCreate, ServicesResponse} = require('../../models/service');

exports.getServiceById = async function(id){
	return ServicesQuery.call(this, {_id: ObjectId(id)});
};


exports.getServiceByName = async function(name){
	return ServicesQuery.call(this, {name});
};

exports.getAllServices = async function(filter, paginator){
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
	const result = await collection.find(filter).skip(offset).limit(paginator.count).toArray();
	return result.map(r => new ServicesResponse(r));
};

exports.getServicesWithPages = async function(filter, paginator) {
	const [services, pages] = await Promise.all([
		exports.getAllServices(filter, paginator),
		exports.getCount(filter)
	]);
	return {
		data: services,
		meta: {
			pages: Math.ceil(pages / paginator.count)
		}
	}
};

exports.saveService = async function(Service){
	const collection = this.mongo.collection(collectionName);
	const entity = new ServicesCreate(Service);
	await collection.insert(entity);
};

exports.getCount = async function(filter={}){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter || {});
};

exports.updateService = async function(id, hospital){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: ObjectId(id)}, hospital);
};

exports.deleteService = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: ObjectId(id)});
};

async function ServicesQuery(filter){
	const collection = this.mongo.collection(collectionName);
	const [Service] = await collection.find(filter).limit(1).toArray();
	return new ServicesResponse(Service || {});
}


