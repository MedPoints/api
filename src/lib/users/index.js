const dal = require('../../dal/index');

exports.createUser = async (walletId, walletKey) => {
	return {walletId, walletKey}
};

exports.getUser = async (walletId, walletKey) => {
	return {walletId, walletKey}
};
