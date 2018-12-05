const collectionName = 'services';

const ObjectId = require('mongodb').ObjectId;

const {ServiceCreate, ServiceResponse} = require('../../models/service');

exports.getServiceById = async function(id, raw=false){
	return ServicesQuery.call(this, {_id: new ObjectId(id)}, raw);
};


exports.getServiceByName = async function(name){
	return ServicesQuery.call(this, {name: {$regex: name}});
};

exports.getAllServices = async function(filter, paginator){
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
	const result = await collection.find(filter).skip(offset).limit(paginator.count).toArray();
	return result.map(r => new ServiceResponse(r));
};

exports.getServicesWithPages = async function(filter, paginator) {
	const [services, total] = await Promise.all([
		exports.getAllServices(filter, paginator),
		exports.getCount(filter)
	]);
	return {
		data: services,
		meta: {
			pages: Math.ceil(total / paginator.count),
			current: paginator.page,
			total,
		}
	}
};

exports.saveService = async function(service){
	const collection = this.mongo.collection(collectionName);
	const entity = new ServiceCreate(service);
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

async function ServicesQuery(filter, raw=false){
	const collection = this.mongo.collection(collectionName);
	const [service] = await collection.find(filter).limit(1).toArray();
	if (!service) {
		return null;
	}
	if(raw){
		return service;
	}
	return new ServiceResponse(service || {});
}


