'use strict';

const config = require('config');
const dal = require('../../dal/index');
const notifications = require('../../notifications/events');

exports.addSubscription = async (email) => {
	const subDAL = await dal.open('subscriptions');
	try{
		const subscription = await subDAL.getSubscription(email);
		if (subscription) {
			return 'ALREADY_EXISTS';
		}
		await subDAL.addSubscription(email);
		notifications.raise('subscription',  config.get('adminEmail'), {email});
		return 'OK'
	} finally{
		subDAL.close();
	}
};
