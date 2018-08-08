class Rate {
	constructor({rate, comment}) {
		this.rate = Math.min(rate || 0, 10);
		this.comment = comment;
		this.dateCreated = new Date();
	}
}

class DoctorRate extends Rate {
	constructor({rate, comment, commonRate}){
		super({rate, comment, commonRate});
		this.commonRate = new DoctorCommonRate(commonRate || {})
	}
}

class DoctorCommonRate {
	constructor({knowledge, skills, attention, priceQuality}) {
		this.knowledge = Math.min(knowledge || 0, 10);
		this.skills = Math.min(skills || 0, 10);
		this.attention = Math.min(attention || 0, 10);
		this.priceQuality = Math.min(priceQuality || 0, 10);
	}
}

class PharmacyRate extends Rate {
	constructor(rate) {
		super(rate);
		this.commonRate = new PharmacyCommonRate(rate.commonRate || {});
	}
}

class PharmacyCommonRate {
	constructor(entity) {
		this.service = Math.min(entity.service || 0, 10);
		this.priceQuality = Math.min(entity.priceQuality, 10);
	}
}

exports.DoctorRate = DoctorRate;
exports.DoctorCommonRate = DoctorCommonRate;
exports.PharmacyRate = PharmacyRate;
exports.PharmacyCommonRate = PharmacyCommonRate;
