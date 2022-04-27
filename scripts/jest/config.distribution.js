const sourceConfig = require('./config.source');

module.exports = {
  ...sourceConfig,
  moduleNameMapper: {'^../source$': '<rootDir>/distribution/index.cjs'},
};
