class Paginator {
	constructor({page, count}) {
		this.page = parseInt(page, 10) || 1;
		this.count = parseInt(count, 10) || 10;
	}
	getOffset(){
		return this.count * (this.page - 1)
	}
}

exports.createPaginator = function(query){
	return new Paginator(query);
};
