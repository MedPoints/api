const ObjectId = require("mongodb").ObjectId;
const LocationModel = require('./location');

class BasePharmaciesModel {
	constructor({name, slug, network, coordinations, location, workTime, work_time, photos, drugs, short_descr, site, ratings}){
		this.name = name;
		this.slug = slug;
		this.network = network;
        this.coordinations = coordinations || {};
		this.location = new LocationModel(location);
		this.work_time = workTime || work_time;
		this.photos = photos || [];
		this.drugs = drugs || [];
		this.short_descr = short_descr || "";
		this.site = site || '';
		this.ratings = ratings || [];
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
		this.rate = this.ratings.reduce((result, r) => result + r.rate, 0);
		if (this.ratings.length > 0) {
			this.rate /= this.ratings.length;
			this.rate = Math.floor(this.rate);
		}
		const opinion = this.ratings.reduce((result, rate) => {
			const {service, priceQuality} = rate.commonRate;
			result.service += service;
			result.priceQuality += priceQuality;
			return result;
		}, {service: 0, priceQuality: 0});
		if (this.ratings.length !== 0) {
			opinion.service = round(opinion.service / this.ratings.length);
			opinion.priceQuality = round(opinion.priceQuality / this.ratings.length);
		}
		this.opinion = opinion;
	}
}

exports.PharmaciesCreate = PharmaciesCreate;
exports.PharmaciesResponse = PharmaciesResponse;
