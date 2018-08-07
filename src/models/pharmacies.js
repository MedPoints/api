const ObjectId = require("mongodb").ObjectId;
const LocationModel = require('./location');

class BasePharmaciesModel {
	constructor({name, network, coordinations, location, workTime, work_time, photos, drugs, short_descr, site}){
		this.name = name;
		this.network = network;
        this.coordinations = coordinations || {};
		this.location = new LocationModel(location);
		this.work_time = workTime || work_time;
		this.photos = photos || [];
		this.drugs = drugs || [];
		this.short_descr = short_descr || "";
		this.site = site || '';
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
