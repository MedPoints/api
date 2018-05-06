const users = require('../../lib/users/index');

exports.get = async (req, res) => {
	const {name} = req.query;
	const user = await users.getUserByName(name);
	res.send(user);
};