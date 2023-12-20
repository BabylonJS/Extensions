const config = {
    verbose: true,
    collectCoverage: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/tests/fixtures/'],
    transform: {}
};

export default config;
