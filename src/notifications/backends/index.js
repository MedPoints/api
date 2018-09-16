'use strict';

const config = require('config');

const Email = require('./email');

module.exports = {
	email: new Email(config.get('notifications.email')),
};
