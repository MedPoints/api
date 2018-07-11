const ObjectId = require("mongodb").ObjectId;
const LocationModel = require('./location');

class BasePharmaciesModel {
	constructor({name, description, location, workTime}){
		this.name = name;
		this.description = description;
		this.location = new LocationModel(location);
		this.work_time = workTime;
	}
}

class PharmaciesCreate extends BasePharmaciesModel {
	constructor(entity){
		super(entity);
		this._id = ObjectId(entity._id || entity.id);
	}
}

class PharmaciesResponse extends BasePharmaciesModel {
	constructor(entity) {
		super(entity);
		this.id = entity._id || entity.id;
	}
}

exports.PharmaciesCreate = PharmaciesCreate;
exports.PharmaciesResponse = PharmaciesResponse;
