const example = require('../../lib/example');

exports.get = async (req, res) => {
	const {a, b} = req.query;
	const sum = await example.sum(parseInt(a), parseInt(b));
	res.send(`Ok ${sum}`);
};
exports.post = async (req, res) => {
	res.send('OK POST');
};