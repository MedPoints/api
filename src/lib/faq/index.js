'use strict';

const config = require('config');

const notifications = require('../../notifications/events');

exports.createQuestion = async (question) => {
    const email = config.get('adminEmail');
    notifications.raise('new_question', email, question);
    return {status: 'ok'};
};
