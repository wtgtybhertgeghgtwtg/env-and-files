// @flow
import type {EnvironmentConfig} from './types';

export default function loadEnvironmentConfig(property: EnvironmentConfig) {
  const {required = false, variableName} = property;

  // '' is falsey, so `process.env[variableName] || null` would not behave right when the variable is set to ''.
  let config = process.env[variableName];

  // `process.env[variableName] ?? null`, on the other hand.
  if (typeof config !== 'string') {
    config = null;
  }

  const error =
    required && typeof config !== 'string'
      ? new Error(`${variableName} is not defined.`)
      : null;

  return {config, error};
}
