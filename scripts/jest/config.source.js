module.exports = {
  collectCoverageFrom: ['source/**/*.ts', '!source/{index,types}.ts'],
  rootDir: process.cwd(),
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
};
