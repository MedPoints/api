const {ObjectId} = require("mongodb");

class BaseGroupModel {
	constructor({name, drugs}) {
		this.name = name;
		this.drugs = drugs || [];
	}
}

class GroupCreate extends BaseGroupModel {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
	}
}

class GroupResponse extends BaseGroupModel {
	constructor(entity) {
		super(entity);
		this.id = entity.id || entity._id;
		this.drugs = this.drugs.length;
	}
}

class GroupDrugModelResponse extends GroupResponse {
	constructor(entity) {
		super(entity);
		delete this.drugs;
	}
}


exports.GroupCreate = GroupCreate;
exports.GroupResponse = GroupResponse;
exports.GroupDrugModelResponse = GroupDrugModelResponse;
