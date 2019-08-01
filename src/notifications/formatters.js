'use strict';

exports.registration = function({token, firstName, lastName}){
	const fullname = `${firstName} ${lastName}`;
	const link = `http://46.101.121.69:8080/api/users/confirm?token=${token}`;
	return {
		fullname,
		link,
	};
};

exports.ticket = function(ticket){
	return ticket;
};

exports.question = function(question){
	return question;
};

exports.subscription = function(email){
	return email;
};

exports.book = function({doctor, hospital, service, date}){
	return {doctor, hospital, service, date};
};
