'use strict';

const Promise = require('bluebird');
const {DoctorRate} = require('../../models/rates');
const {ObjectId} = require('mongodb');
const {DoctorCreate, DoctorResponse} = require("../../models/doctors");

const collectionName = 'doctors';

/**
 * @param {String} id -- doctor id
 * @returns {Promise<DoctorResponse>}
 */
exports.getDoctorById = async function(id){
	const [result] = await exports.getDoctors({_id: new ObjectId(id)}, null, true);
	if (!result) {
		return null;
	}
	return new DoctorResponse(result || {});
};

exports.getDoctors = async function(filter, paginator, raw=false){
	const collection = this.mongo.collection(collectionName);
	let doctors = collection.aggregate([
		{$match: filter},
		{
			$lookup: {
				from: 'hospitals',
				let: {sid: {$toString: "$_id"}},
				pipeline: [
					{$unwind: '$doctors'},
					{$match: {$expr: {$eq: ['$$sid', '$doctors']}}},
					{
						$project: {
							id: '$id',
							name: 1,
							slug: 1,
							departments: 1,
							location: 1,
							coordinations: 1
						}
					}],
				as: 'hospitals',
			}
		},
		{
			$addFields: {
				serviceIds: {
					$map: {
						input: '$services',
						as: 'id',
						in: {$toObjectId: '$$id'}
					}
				}
			}
		},
		{
			$lookup: {
				from: 'services',
				localField: 'serviceIds',
				foreignField: '_id',
				as: 'services'
			}
		},
		{
			$addFields: {
				hospital: {$arrayElemAt: ['$hospitals', 0]}
			}
		},
		{
			$project: {
				_id: 0,
				id: '$_id',
				name: 1,
				slug: 1,
				prefix: 1,
				statement: 1,
				ratings: 1,
				specializations: 1,
				services: {
					$map: {
						input: '$services',
						as: 'service',
						in: {
							id: '$$service._id',
							name: '$$service.name'
						}
					}
				},
				hospital: {
					id: '$hospital._id',
					name: '$hospital.name',
					departments: '$hospital.departments',
					location: '$hospital.location',
				},
				coordinations: '$hospitals.coordinations',
				education: 1,
			}
		}
	]);
	if(paginator){
		const offset = paginator.getOffset();
		doctors = doctors.skip(offset).limit(paginator.count);
	}
	doctors = await doctors.toArray();
	if(raw){
		return doctors;
	}
	return doctors.map(d => new DoctorResponse(d));
};

exports.getDoctorsBySpecialization = async function(specialization, paginator){
	const collection = this.mongo.collection(collectionName);
	const offset = paginator.getOffset();
	const doctors = await collection.find({specialization}).skip(offset).limit(paginator.count).toArray();
	return doctors.map(d => new DoctorResponse(d));
};

exports.getDoctorsWithPages = async function(filter, paginator){
	const [doctors, total] = await Promise.all([
		exports.getDoctors(filter, paginator),
		exports.getCount(filter)
	]);
	return {
		data: doctors,
		meta: {
			pages: Math.ceil(total / paginator.count),
			current: paginator.page,
			total,
		}
	}
};

exports.getCount = async function(filter = {}){
	const collection = this.mongo.collection(collectionName);
	return collection.count(filter || {});
};


/**
 *
 * @param doctor
 * @returns {Promise<void>}
 */
exports.saveDoctor = async function(doctor){
	const collection = this.mongo.collection(collectionName);
	const entity = new DoctorCreate(doctor);
	await collection.insert(entity);
};


/**
 *
 * @param {String} id
 * @param {DoctorResponse} doctor
 */
exports.updateDoctor = async function(id, doctor){
	const collection = this.mongo.collection(collectionName);
	delete doctor.id;
	await collection.update({_id: new ObjectId(id)}, {$set: doctor});
};

/**
 * @param {String} id
 */
exports.deleteDoctor = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: new ObjectId(id)});
};


/**
 * @param {String} id
 * @param {Object} rate
 * @returns {Promise<void>}
 */
exports.changeRateOfDoctor = async function(id, rate){
	const collection = this.mongo.collection(collectionName);
	const entity = new DoctorRate(rate);
	await collection.update({_id: new ObjectId(id)}, {
		$push: {ratings: entity}
	});
};
