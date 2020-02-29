'use strict';

const collectionName = 'tokens';

exports.getTokensByPublicKey = async function(publicKey){
	return await exports.getTokens({publicKey: publicKey});
}

exports.getTokens = async function(filter){
	const collection = this.mongo.collection(collectionName);
	let tokens = await collection.find(filter).toArray();
	return tokens;
}

exports.addToken = async function(token){
	const collection = this.mongo.collection(collectionName);
	await collection.insert(token);
};

