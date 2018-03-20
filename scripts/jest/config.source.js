module.exports = {
  collectCoverageFrom: ['src/**/*.js', '!src/{index,types}.js'],
  rootDir: process.cwd(),
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
};
