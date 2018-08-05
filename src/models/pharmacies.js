const ObjectId = require("mongodb").ObjectId;
const LocationModel = require('./location');

class BasePharmaciesModel {
	constructor({name, description, network, location, workTime, work_time, drugs, photos, country, city, address, short_descr}){
		this.name = name;
		this.network = network;
		this.description = description;
		this.location = new LocationModel(location);
		this.country = country;
		this.city = city;
		this.address = address;
		this.work_time = workTime || work_time;
		this.photos = photos || [];
		this.drugs = drugs || [];
		this.short_descr = short_descr || [];
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
		this.drugs = this.drugs.length;
	}
}

exports.PharmaciesCreate = PharmaciesCreate;
exports.PharmaciesResponse = PharmaciesResponse;
