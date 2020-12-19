module.exports = {
  collectCoverageFrom: ['src/**/*.ts', '!src/{index,types}.ts'],
  rootDir: process.cwd(),
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
};
