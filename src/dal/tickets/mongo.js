'use strict';

const collectionName = 'tickets';

exports.createTicket = async function(ticket){
	const collection = await this.mongo.collection(collectionName);
	await collection.insert(ticket)
};
