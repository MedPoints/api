'use strict';

const nodemailer = require('nodemailer');
const BaseNotification = require('./base');


class EmailNotification extends BaseNotification {
	constructor(config){
		super(config);
		this.transporter = nodemailer.createTransport({
			host: this.config.host,
			port: this.config.port,
			secure: false,
			auth: this.config.auth,
		});
	}
	
	async send({to, subject, message}){
		return this.transporter.sendMail({
			from: `"MedPoints" <${this.config.auth.user}>`,
			to,
			subject,
			html: message,
		});
	}
}

module.exports = EmailNotification;
