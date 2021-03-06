const collectionName = 'drug_groups';

const {ObjectId} = require('mongodb');

const {GroupCreate, GroupResponse} = require('../../models/group');

exports.getAllCategories = async function(filter, paginator){
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
	const result = await collection.find(filter).skip(offset).limit(paginator.count).toArray();
	return result.map(c => new GroupResponse(c));
};

exports.getCategoryById = async function(id){
	return exports.getCategoryByFilter({_id: new ObjectId(id)});
};

exports.getCategoryByName = async function(name){
	return exports.getCategoryByFilter({name: name});
};

exports.getGroupsByInterval = async function(filter){
	const collection = this.mongo.collection(collectionName);
	const result = await collection.find(filter).toArray();
	return result.map(el => {
		return {
			id: el._id.toString(), 
			drugs: el.drugs,
		};
	});
};

exports.saveCategory = async function(category){
	const collection = this.mongo.collection(collectionName);
	const entity = new GroupCreate(category);
	entity.timestamp = category.timestamp;
	await collection.insert(entity);
	return entity;
};

exports.updateCategory = async function(id, entity){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: new ObjectId(id)}, entity);
};

exports.getCategoryByFilter = async function(filter){
	const collection = this.mongo.collection(collectionName);
	const [result] = await collection.find(filter).limit(1).toArray();
	return new GroupResponse(result || {});
};

exports.deleteCategory = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: new ObjectId(id)});
};

exports.getCount = async function(filter={}){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter || {});
};

exports.getGroupsWithPages = async function(filter, paginator) {
	const [doctors, total] = await Promise.all([
		exports.getAllCategories(filter, paginator),
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

exports.deleteGroup = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: new ObjectId(id)});
};