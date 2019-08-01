class ResponseWithMeta {
	constructor({data, meta}) {
		this.data = data;
		this.meta = meta;
	}
}

exports.ResponseWithMeta = ResponseWithMeta;


class LocationsResponse{
    constructor({worldsCount, locations}) {
        this.worldsCount = worldsCount;
        this.locations = locations;
    }
}

exports.LocationsResponse = LocationsResponse;
