const ObjectId = require("mongodb").ObjectId;

const Price = require('./price');

class BaseServiceModel {
	constructor({name, slug, short_descr, full_descr, is_covered_by_insurance, price, time, providers}){
		this.name = name;
		this.slug = slug;
		this.short_descr = short_descr;
		this.full_descr = full_descr;
		this.is_covered_by_insurance = is_covered_by_insurance;
		this.price = new Price(price);
		this.time = time;
		this.providers = providers || {};
	}
}

class ServiceCreate extends BaseServiceModel {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
	}
}

class ServiceResponse extends BaseServiceModel {
	constructor(entity) {
		super(entity);
		this.id = entity.id || entity._id;
	}
}


exports.ServiceCreate = ServiceCreate;
exports.ServiceResponse = ServiceResponse;
