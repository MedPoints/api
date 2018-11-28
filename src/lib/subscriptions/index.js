'use strict';

const dal = require('../../dal/index');

exports.addSubscription = async (email) => {
	const subDAL = await dal.open('subscriptions');
	try{
		const subscription = await subDAL.getSubscription(email);
		if (subscription) {
			return 'ALREADY_EXISTS';
		}
		await subDAL.addSubscription(email);
		return 'OK'
	} finally{
		subDAL.close();
	}
};
