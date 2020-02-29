'use strict';

const collectionName = 'foundations';

exports.getFoundationsByPublicKey = async function(publicKey){
	return await exports.getFoundations({publicKey: publicKey});
}

exports.getFoundations = async function(filter){
	const collection = this.mongo.collection(collectionName);
	let foundations = await collection.find(filter).toArray();
	return foundations;
}

exports.addFoundation = async function(foundation){
	const collection = this.mongo.collection(collectionName);
	await collection.insert(foundation);
};

