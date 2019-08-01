'use strict';

const crypto = require('crypto');

exports.createUserId = (publicKey, privateKey) => crypto.createHash('sha256').update(`${publicKey}:${privateKey}`).digest('hex');
