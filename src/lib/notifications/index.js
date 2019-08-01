'use strict';

const Promise = require('bluebird');

const dal = require('../../dal/index');
const notification = require('../../notifications/events');

exports.renderBook = async ({email, data}) => {
	const [
		doctorDAL,
		hospitalDAL,
		serviceDAL
	] = await Promise.all([
		dal.open('doctors'),
		dal.open('hospitals'),
		dal.open('services'),
	]);
	const {doctor, hospital, service, date} = data;
	try{
		const [
			doctorData,
			hospitalData,
			serviceData,
		] = await Promise.all([
			doctorDAL.getDoctorById(doctor),
			hospitalDAL.getHospitalById(hospital),
			serviceDAL.getServiceById(service)
		]);
		notification.raise('book', email, {
			doctor: {name: doctorData.name, id: doctor},
			hospital: {name: hospitalData.name, id: hospital},
			service: {name: serviceData.name, id: service},
			date,
		});
	} finally{
		doctorDAL.close();
		hospitalDAL.close();
		serviceDAL.close();
	}
};
