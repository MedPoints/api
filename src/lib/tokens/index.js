'use strict';

const dal = require('../../dal/index');

exports.getTokensByPublicKey = async (publicKey) => {
	const tokensDAL = await dal.open('tokens');
	try{
		return await tokensDAL.getTokensByPublicKey(publicKey);
	}catch(err){
		log.error({publicKey}, 'getTokensByPublicKey error', err);
		throw err;
	}finally{
		tokensDAL.close();
	}
};

exports.addToken = async (token) => {
	const tokensDAL = await dal.open('tokens');
	try{
		await tokensDAL.addToken(token);
	}catch(err){
		log.error('addToken error', err);
		throw err;
	}finally{
		tokensDAL.close()
	}
};