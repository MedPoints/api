'use strict';

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const Promise = require('bluebird');

const backends = require('./backends/index');

const log = require('../utils/logger').getLogger('NOTIFICATIONS');

exports.sendConfirmMessage = async function({token, email, firstName, lastName}){
	const file = await Promise.promisify(fs.readFile, {context: fs})(path.join(__dirname, 'templates', 'register.html'));
	const template = handlebars.compile(file.toString());
	const fullname = `${firstName} ${lastName}`;
	const link = `http://46.101.121.69:8080/api/auth/confirm?token=${token}`;
	const html = template({
		fullname: fullname,
		link: link,
	});
	setImmediate(() => {
		backends.email.send({
			to: email,
			subject: 'Confirmation',
			message: html,
		}).catch((err) => {
			log.error(err, 'notification_err');
		});
	});
};
