// @flow
import type {EnvironmentConfig} from './types';

export default function loadEnvironmentConfig(property: EnvironmentConfig) {
  const {required = false, variableName} = property;
  const value = process.env[variableName];
  const error =
    required &&
    typeof value !== 'string' &&
    new Error(`${variableName} is not defined.`);

  return {error, value};
}
