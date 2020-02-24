'use strict';

const collectionName = 'uploads';

exports.getUploadsByPublicKey = async function(publicKey){
	return await exports.getUploads({publicKey: publicKey});
}

exports.getUploads = async function(filter){
	const collection = this.mongo.collection(collectionName);
	let uploads = await collection.find(filter).toArray();
	return uploads;
}

exports.addUpload = async function(upload){
	const collection = this.mongo.collection(collectionName);
	await collection.insert(upload);
};

