// @flow
import type {Config, ConfigMap} from './types';

export default class ConfigError<CMap: ConfigMap> extends Error {
  config: Config<CMap>;
  errors: Array<Error>;

  constructor(config: Config<CMap>, errors: Array<Error>) {
    super('Configuration could not be loaded.');
    this.config = config;
    this.errors = errors;
    this.message = 'Configuration could not be loaded.';
  }
}
