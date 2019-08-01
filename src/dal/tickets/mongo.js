'use strict';

const collectionName = 'tickets';

exports.createTicket = async function(ticket){
	const collection = await this.mongo.collection(collectionName);
	await collection.insert(ticket)
};

exports.getTicketsByUser = async function(userId){
	const collection = await this.mongo.collection(collectionName);
	return collection.find({userId}).toArray();
};
