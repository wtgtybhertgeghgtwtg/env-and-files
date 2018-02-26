// @flow
import type {ConfigResult} from './types';

export default class ConfigError<Config: ConfigResult<any>> extends Error {
  config: Config;
  errors: Array<Error>;

  constructor(config: Config, errors: Array<Error>) {
    super('Configuration could not be loaded.');
    this.config = config;
    this.errors = errors;
    this.message = 'Configuration could not be loaded.';
  }
}
