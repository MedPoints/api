const collectionName = 'drug_groups';

const {ObjectId} = require('mongodb');

const {GroupCreate, GroupResponse} = require('../../models/group');

exports.getAllCategories = async function(){
	const collection = this.mongo.collection(collectionName);
	const categories = await collection.find({}).toArray();
	return categories.map(c => new GroupResponse(c));
};

exports.getCategoryById = async function(id){
	return exports.getCategoryByFilter({_id: ObjectId(id)});
};

exports.getCategoryByName = async function(name){
	return exports.getCategoryByFilter({name: name});
};

exports.saveCategory = async function(category){
	const collection = this.mongo.collection(collectionName);
	const entity = new GroupCreate(category);
	await collection.insert(entity);
};

exports.updateCategory = async function(id, category){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: ObjectId(id)}, category);
};

exports.getCategoryByFilter = async function(filter){
	const collection = this.mongo.collection(collectionName);
	const [result] = await collection.find(filter).limit(1).toArray();
	return new GroupResponse(result || {});
};

exports.deleteCategory = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: ObjectId(id)});
};
