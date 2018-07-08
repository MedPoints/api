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
		this.knowledge = Math.min(knowledge || 0);
		this.skills = Math.min(skills || 0);
		this.attention = Math.min(attention || 0);
		this.priceQuality = Math.min(priceQuality || 0);
	}
}

exports.DoctorRate = DoctorRate;
exports.DoctorCommonRate = DoctorCommonRate;
