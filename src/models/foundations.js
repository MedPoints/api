'use strict';

class Foundation {
	constructor({publicKey, transactionId, name, link, treatment, timestamp}){
		this.publicKey = publicKey;
		this.transactionId = transactionId;
		this.name = name;
		this.link = link;
		this.treatment = treatment;
		this.timestamp = timestamp;
	}
}

exports.Foundation = Foundation;
