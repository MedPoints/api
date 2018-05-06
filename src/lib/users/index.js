const dal = require('../../dal/index');

exports.getUserByName = async (name) => {
	const userDal = await dal.open('users');
	try{
		return userDal.getUserByName(name);
	}
	finally{
		userDal.close();
	}
};