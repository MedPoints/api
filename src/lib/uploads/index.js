'use strict';

const dal = require('../../dal/index');

exports.getUploadsByPublicKey = async function(publicKey) {
	const uploadsDAL = await dal.open('uploads');
	try{
		return await uploadsDAL.getUploadsByPublicKey(publicKey);
	}catch(err){
		log.error({publicKey}, 'getUploadsByPublicKey error', err);
		throw err;
	}finally{
		uploadsDAL.close();
	}
};