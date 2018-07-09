const ObjectId = require("mongodb").ObjectId;

class HospitalBaseModel {
	constructor({name, network, departments, specialiazions, coordinations, email, phone, address, photos, doctors, openingHours}) {
		this.name = name || '';
		this.network = network || '';
		this.specialiazions = specialiazions || '';
		this.departments = departments || [];
		this.coordinations = coordinations || {};
		this.email = email || '';
		this.phone = phone || '';
		this.address = address || '';
		this.photos = photos || [];
		this.doctors = doctors || [];
		this.openingHours = openingHours || [];
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
