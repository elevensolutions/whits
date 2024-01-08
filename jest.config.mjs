export default {
	transform: {},
	testEnvironment: 'node',
	testMatch: ['**/tests/dist/*.test.js'],
	moduleFileExtensions: ['js'],
	verbose: true,
	collectCoverage: true,
	coverageProvider: 'v8',
	coverageReporters: ['json-summary', 'text', 'lcov']
};
