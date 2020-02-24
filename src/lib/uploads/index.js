'use strict';

const dal = require('../../dal/index');

exports.getUploadsByPublicKey = async (publicKey) => {
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

exports.addUpload = async (upload) => {
	const uploadsDAL = await dal.open('uploads');
	try{
		await uploadsDAL.addUpload(upload);
	}catch(err){
		log.error('addUpload error', err);
		throw err;
	}finally{
		uploadsDAL.close()
	}
};