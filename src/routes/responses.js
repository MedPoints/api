class ResponseWithMeta {
	constructor({data, meta}) {
		this.data = data;
		this.meta = meta;
	}
}

exports.ResponseWithMeta = ResponseWithMeta;


class LocationsResponse{
    constructor({woldsCount, locations}) {
        this.woldsCount = address;
        this.locations = locations;
    }
}

exports.LocationsResponse = LocationsResponse;