'use strict';

const uuid = require('uuid/v4');
const crypto = require('crypto');

const User = require('../../models/user');

const dal = require('../../dal/index');
const notifications = require('../../notifications/index');

exports.register = async ({publicKey, privateKey, firstName, lastName, email}) => {
	const authDAL = await dal.open('auth');
	try{
		const confirmationToken = uuid();
		const base64ConfirmationToken = Buffer.from(confirmationToken).toString('base64');
		const id = createId(publicKey, privateKey);
		const existedUser = await authDAL.getUserById(id);
		if(existedUser){
			if(existedUser.confirmed){
				throw new Error('USER_ALREADY_EXISTS');
			}
			await authDAL.deleteUserById(id);
		}
		const user = {
			_id: id,
			publicKey,
			privateKey,
			confirmationToken,
			confirmed: false,
			firstName,
			lastName,
			email,
		};
		await authDAL.register(user);
		await notifications.sendConfirmMessage({
			token: base64ConfirmationToken,
			firstName,
			lastName,
			email,
		});
		return new User(user);
	}finally{
		authDAL.close();
	}
};

exports.confirm = async({token}) => {
	const authDAL = await dal.open('auth');
	try{
		const decodedToken = Buffer.from(token, 'base64').toString();
		const user = await authDAL.getUserByConfirmId(decodedToken);
		if(!user){
			throw new Error('CONFIRMATION_FAILED');
		}
		if(user.confirmed){
			throw new Error('ALREADY_CONFIRMED');
		}
		await authDAL.confirmUser(user._id);
		return 'OK';
	}finally{
		authDAL.close();
	}
};

exports.auth = async ({publicKey, privateKey}) => {
	const authDAL = await dal.open('auth');
	try{
		const id = createId(publicKey, privateKey);
		const user = await authDAL.getUserById(id);
		if(!user){
			throw new Error('USER_NOT_EXIST');
		}
		if(!user.confirmed){
			throw new Error('USER_NOT_CONFIRMED');
		}
		return new User(user);
	}finally{
		authDAL.close();
	}
};

function createId(publicKey, privateKey){
	const id = `${publicKey}:${privateKey}`;
	return crypto.createHash('sha256').update(id).digest('hex');
}
