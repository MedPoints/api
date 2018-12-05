const ObjectId = require("mongodb").ObjectId;
const LocationModel = require('./location');

class HospitalBaseModel {
	constructor({name, network, departments, specializations, coordinations, email, phone, site, location, photos, doctors, workTime, work_time, ratings}) {
		this.name = name || '';
		this.network = network || '';
		this.specializations = specializations || [];
		this.departments = departments || [];
		this.coordinations = coordinations || {};
		this.email = email || '';
		this.phone = phone || '';
		this.site = site || '';
		this.location = new LocationModel(location || {});
		this.photos = photos || [];
		this.doctors = doctors || [];
		this.work_time = workTime || work_time;
		this.ratings = ratings || [];
	}
}

class HospitalCreate extends HospitalBaseModel {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
	}
}

class HospitalResponse extends HospitalBaseModel {
	constructor(entity) {
		super(entity);
		this.id = entity.id || entity._id;
	}
}

exports.HospitalBaseModel = HospitalBaseModel;
exports.HospitalCreate = HospitalCreate;
exports.HospitalResponse = HospitalResponse;
