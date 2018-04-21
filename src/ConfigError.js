// @flow
export default class ConfigError extends Error {
  errors: Array<Error>;

  constructor(errors: Array<Error>) {
    super('Configuration could not be loaded.');
    this.errors = errors;
    this.message = 'Configuration could not be loaded.';
  }

  toJSON() {
    // Flow complains about not having it this way, for some reason.
    const errors: Array<string> = this.errors.map(error => error.message);
    return {
      errors,
      message: this.message,
    };
  }
}
