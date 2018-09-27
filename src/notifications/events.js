'use strict';

const {EventEmitter} = require('events');
const {render} = require('./renderer');
const {registration, ticket} = require('./formatters');
const backends = require('./backends/index');

class NotificationEvents{
	constructor(){
		this.emitter = new EventEmitter();
		this._initEvents();
	}
	
	raise(event, destination, data){
		const {emitter} = this;
		emitter.emit(event, {destination, data});
	}
	
	_initEvents(){
		const {emitter} = this;
		function onEvent(tmp, messageFormatter) {
			return async ({destination, data}) => {
				const input = messageFormatter(data);
				const template = await render({
					template: tmp,
					data: input
				});
				await backends.email.send({
					to: destination,
					subject: template.subject,
					message: template.message,
				});
			};
		}
		emitter.on('registration', onEvent('registration', registration));
		emitter.on('ticket', onEvent('ticket', ticket));
	}
}

module.exports = new NotificationEvents();
