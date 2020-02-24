'use strict';

const ObjectId = require("mongodb").ObjectId;

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

class UploadCreate extends Upload {
	constructor(entity) {
		super(entity);
		this._id = new ObjectId(entity._id || entity.id);
	}
}

exports.UploadCreate = UploadCreate;
