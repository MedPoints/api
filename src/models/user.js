'use strict';

class User {
	constructor({publicKey, privateKey, email, firstName, lastName}){
		this.publicKey = publicKey;
		this.privateKey = privateKey;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
	}
}

module.exports = User;
