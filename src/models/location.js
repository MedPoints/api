class LocationModel {
	constructor({address, city, state, country, postCode}) {
		this.address = address;
		this.city = city;
		this.state = state;
		this.country = country;
		this.postCode = postCode;
	}
}

module.exports = LocationModel;
