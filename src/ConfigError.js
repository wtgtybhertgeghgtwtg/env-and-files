// @flow
export default class ConfigError extends Error {
  errors: Array<Error>;

  constructor(errors: Array<Error>) {
    super('Configuration could not be loaded.');
    this.errors = errors;
    this.message = 'Configuration could not be loaded.';
  }
}
