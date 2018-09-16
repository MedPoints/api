'use strict';

const collectionName = 'users';

exports.getUserById = async function(id){
	const collection = this.mongo.collection(collectionName);
	const [user] = await collection.find({_id: id}).limit(1).toArray();
	return user;
};

exports.deleteUserById = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: id});
};

exports.register = async function(user){
	const collection = this.mongo.collection(collectionName);
	await collection.insert(user);
};

exports.getUserByConfirmId = async function(token){
	const collection = this.mongo.collection(collectionName);
	const [user] = await collection.find({confirmationToken: token}).limit(1).toArray();
	return user;
};

exports.confirmUser = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.update({_id: id}, {$set: {confirmed: true}});
};
