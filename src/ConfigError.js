// @flow
export default class ConfigError extends Error {
  errors: Array<Error>;

  constructor(errors: Array<Error>) {
    super('Configuration could not be loaded.');
    this.errors = errors;
  }

  toJSON(): {|errors: Array<string>, message: string|} {
    return {
      errors: this.errors.map(error => error.message),
      message: this.message,
    };
  }
}
