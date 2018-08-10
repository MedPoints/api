const ObjectId = require("mongodb").ObjectId;


class BaseDoctorModel {
	constructor({name, prefix, specializations, services, statement, education, ratings}) {
		this.name = name;
		this.prefix = prefix;
		this.specializations = specializations || [];
		this.services = services || [];
		this.statement = statement || '';
		this.ratings = ratings || [];
		this.education = (education || []).map(ed => new Education(ed));
	}
}

class DoctorCreate extends BaseDoctorModel {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity._id || entity.id);
	}
}

class DoctorResponse extends BaseDoctorModel {
	constructor(entity) {
		super(entity);
		this.id = entity._id || entity.id;
		this.rate = this.ratings.reduce((result, r) => result + r.rate, 0);
		if (this.ratings.length > 0) {
			this.rate /= this.ratings.length;
			this.rate = Math.floor(this.rate);
		}
		const opinion = this.ratings.reduce((result, rate) => {
			const {knowledge, skills, attention, priceQuality} = rate.commonRate;
			result.knowledge += knowledge;
			result.skills += skills;
			result.attention += attention;
			result.priceQuality += priceQuality;
			return result;
		}, {knowledge: 0, skills: 0, attention: 0, priceQuality: 0});
		if (this.ratings.length !== 0) {
			opinion.knowledge /= this.ratings.length;
			opinion.skills /= this.ratings.length;
			opinion.attention /= this.ratings.length;
			opinion.priceQuality /= this.ratings.length;
		}
		this.opinion = opinion;
	}
}

class Education {
	constructor({graduated, university, degree}) {
		this.graduated = graduated || '';
		this.university = university || '';
		this.degree = degree || '';
	}
}

exports.DoctorCreate = DoctorCreate;
exports.DoctorResponse = DoctorResponse;
