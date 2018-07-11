const collectionName = 'drug_groups';

const {ObjectId} = require('mongodb');

const {GroupModelCreated, GroupModelResponse} = require('../../models/group');

exports.getAllCategories = async function(){
	const collection = this.mongo.collection(collectionName);
	const categories = await collection.find({}).toArray();
	return categories.map(c => new GroupModelResponse(c));
};

exports.getCategoryById = async function(id){
	return exports.getCategoryByFilter({_id: ObjectId(id)});
};

exports.getCategoryByName = async function(name){
	return exports.getCategoryByFilter({name: name});
};

exports.saveCategory = async function(category){
	const collection = this.mongo.collection(collectionName);
	const entity = new DrugCatrgoryCreate(category);
	await collection.insert(entity);
};

exports.getCategoryByFilter = async function(filter){
	const collection = this.mongo.collection(collectionName);
	const [result] = await collection.find(filter).limit(1).toArray();
	if (!result) {
		return null;
	}
	return new DrugCategoryResponse(result[0]);
};

exports.deleteCategory = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: ObjectId(id)});
};
