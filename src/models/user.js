'use strict';

class User {
	constructor({publicKey, privateKey, email, firstName, lastName, gender, favorites}){
		this.publicKey = publicKey;
		this.privateKey = privateKey;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.favorites = favorites || [];
	}
}

module.exports = User;
