class LocationModel {
	constructor({address, city, state, country, postCode, coordinates}) {
		this.address = address;
		this.city = city;
		this.state = state;
		this.country = country;
		this.postCode = postCode;
		this.coordinates = coordinates;
	}
}

module.exports = LocationModel;
