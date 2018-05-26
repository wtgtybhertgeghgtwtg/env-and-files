// @flow
import type {EnvironmentConfig} from './types';

export default function loadEnvironmentConfig(property: EnvironmentConfig) {
  const {required = false, variableName} = property;
  const config = process.env[variableName];
  const error =
    required &&
    typeof config !== 'string' &&
    new Error(`${variableName} is not defined.`);

  return {config, error};
}
