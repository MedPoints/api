'use strict';

class Token {
	constructor({publicKey, transactionId, name, type, balanceUSD, timestamp}){
		this.publicKey = publicKey;
		this.transactionId = transactionId;
		this.name = name;
		this.type = type;
		this.balanceUSD = balanceUSD;
		this.timestamp = timestamp;
	}
}

exports.Token = Token;
