const example = require('../src/lib/example/index');

test('test', async () => {
	const result = await example.sum(1, 2);
	expect(result).toBe(3);
});