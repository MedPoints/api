const {ObjectId} = require('mongodb');


class BaseSpecializationModel {
	constructor({name}){
		this.name = name;
	}
}


class SpecializationCreateModel extends BaseSpecializationModel {
	constructor(entity){
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
	}
}

class SpecializationResponseModel extends BaseSpecializationModel {
	constructor(entity){
		super(entity);
		this.id = entity.id || entity._id;
	}
}


exports.SpecializationCreateModel = SpecializationCreateModel;
exports.SpecializationResponseModel = SpecializationResponseModel;
