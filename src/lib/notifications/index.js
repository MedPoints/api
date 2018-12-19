'use strict';

const notification = require('../../notifications/events');

exports.renderBook = async ({email, data}) => {
	notification.raise('book', email, data);
};
