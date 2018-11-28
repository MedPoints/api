'use strict';

const collectionName = 'subscriptions';

exports.getSubscription = async function(email) {
	const collection = await this.mongo.collection(collectionName);
	const [subscription] = await collection.find({_id: email}).limit(1).toArray();
	return subscription;
};

exports.addSubscription = async function(email){
	const collection = await this.mongo.collection(collectionName);
	await collection.insert({_id: email});
};
