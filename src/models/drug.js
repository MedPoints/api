const {ObjectId} = require('mongodb');

const Price = require('./price');
const {GroupDrugField} = require('./group');

class BaseDrugModel {
	constructor({name, slug, short_descr, full_descr, group, price, is_covered_by_insurance, is_by_prescription}) {
		this.name = name;
		this.slug = slug;
		this.short_descr = short_descr;
		this.full_descr = full_descr;
		this.price = new Price(price);
		this.is_covered_by_insurance = is_covered_by_insurance;
		this.is_by_prescription = is_by_prescription;
		this.group = new GroupDrugField(group || {});
	}
}

class DrugModelCreate extends BaseDrugModel {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
		this.providers = entity.providers;
	}
}

class DrugModelResponse extends BaseDrugModel {
	constructor(entity) {
		super(entity);
		this.id = entity.id || entity._id;
		this.providers = {pharmacies: entity.providers};
	}
}

exports.DrugModelCreate = DrugModelCreate;
exports.DrugModelResponse = DrugModelResponse;
