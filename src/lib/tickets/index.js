'use strict';

const Promise = require('bluebird');
const config = require('config');
const uuid = require('uuid/v4');

const utils = require('../utils');

const dal = require('../../dal/index');
const notifications = require('../../notifications/events');

/**
 * @param {Object} ticket
 * @returns {Promise<Object>}
 */
exports.createTicket = async (ticket) => {
	const [ticketDal, authDal] = await Promise.all([
		dal.open('tickets'),
		dal.open('auth')
	]);
	try{
		const id = uuid();
		const userId = utils.createUserId(ticket.publicKey, ticket.privateKey);
		const user = await authDal.getUserById(userId);
		if (!user) {
			throw new Error('USER_NOT_FOUND');
		}
		const {email: userEmail} = user;
 		const email = config.get('adminEmail');
		await ticketDal.createTicket(Object.assign({}, ticket, {
			_id: id,
			dateCreated: new Date(),
			status: 'open',
		}));
		notifications.raise('ticket', email, {
			userEmail,
			title: ticket,
			subject: ticket.subject,
			text: ticket.text,
		});
		return {status: 'OK'};
	}finally{
		authDal.close();
		ticketDal.close();
	}
};

/**
 * @param {String} publicKey
 * @param {String} privateKey
 */
exports.getTicketsByUser = async ({publicKey, privateKey}) => {
	const ticketDal = await dal.open('tickets');
	try{
		const userId = utils.createUserId(publicKey, privateKey);
		return await ticketDal.getUserById(userId);
	}finally{
		ticketDal.close();
	}
};
