'use strict';

const dal = require('../../dal/index');

exports.getFoundationsByPublicKey = async (publicKey) => {
	const foundationsDAL = await dal.open('foundations');
	try{
		return await foundationsDAL.getFoundationsByPublicKey(publicKey);
	}catch(err){
		log.error({publicKey}, 'getFoundationsByPublicKey error', err);
		throw err;
	}finally{
		foundationsDAL.close();
	}
};

exports.addFoundation = async (foundation) => {
	const foundationsDAL = await dal.open('foundations');
	try{
		await foundationsDAL.addFoundation(foundation);
	}catch(err){
		log.error('addFoundation error', err);
		throw err;
	}finally{
		foundationsDAL.close()
	}
};