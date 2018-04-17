const sourceConfig = require('./config.source');

module.exports = {
  ...sourceConfig,
  moduleNameMapper: {'../src': '<rootDir>/dist/index.cjs'},
};
