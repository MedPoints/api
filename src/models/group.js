const {ObjectId} = require("mongodb");

class BaseGroupModel {
	constructor({name, drugs}) {
		this.name = name;
		this.drugs = drugs;
	}
}

class GroupModelCreated extends BaseGroupModel {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
	}
}

class GroupModelResponse extends BaseGroupModel {
	constructor(entity) {
		super(entity);
		this.id = entity.id || entity._id;
	}
}

class GroupDrubModelResponse extends GroupModelResponse {
	constructor(entity) {
		super(entity);
		delete this.drugs;
	}
}


exports.GroupModelCreated = GroupModelCreated;
exports.GroupModelResponse = GroupModelResponse;
exports.GroupDrubModelResponse = GroupDrubModelResponse;
