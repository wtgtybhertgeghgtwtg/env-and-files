// @flow
import type {EnvironmentConfig} from './types';

export default function loadEnvironmentConfig(property: EnvironmentConfig) {
  const {defaultValue = null, required = false, variableName} = property;

  // '' is falsey, so `process.env[variableName] || defaultValue` would not behave right when the variable is set to ''.
  let config = process.env[variableName];

  // `process.env[variableName] ?? defaultValue`, on the other hand.
  if (typeof config !== 'string') {
    config = defaultValue;
  }

  const error =
    required && typeof config !== 'string'
      ? new Error(`${variableName} is not defined.`)
      : null;

  return {config, error};
}
