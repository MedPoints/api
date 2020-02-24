'use strict';

class Upload {
	constructor({publicKey, transactionId, fullname, filename, timestamp, extension}){
		this.publicKey = publicKey;
		this.transactionId = transactionId;
		this.fullname = fullname;
		this.filename = filename;
		this.timestamp = timestamp;
		this.extension = extension;
	}
}

exports.Upload = Upload;
