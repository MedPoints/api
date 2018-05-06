const collectionName = 'users';

exports.getUserByName = async function(name){
	const collection = this.mongo.collection(collectionName);
	const users = await collection.find({name}).limit(1).toArray();
	return users[0];
};