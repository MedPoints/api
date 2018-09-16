'use strict';

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const Promise = require('bluebird');

const log = require('../utils/logger').getLogger('RENDERER');

const readFileAsync = Promise.promisify(fs.readFile, {context: fs});

exports.render = async function(renderParams){
	try{
		const pathToTemplate = path.join(__dirname, 'templates', renderParams.template);
		const pathToBody = path.join(pathToTemplate, 'body.html');
		const pathToSubject = path.join(pathToTemplate, 'subject.html');
		const [subject, body] = await Promise.all([
			readFileAsync(pathToSubject),
			readFileAsync(pathToBody),
		]);
		const template = handlebars.compile(body.toString());
		return {subject: subject.toString(), message: template(renderParams.data)};
	}catch(err){
		log.error(err, 'render_err');
		throw err;
	}
};
