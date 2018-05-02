// @flow
import type {EnvironmentConfig} from './types';

export default function loadEnvironmentConfig(property: EnvironmentConfig) {
  const {required = false, variableName} = property;

  // '' is falsey, so `process.env[variableName] || undefined` would not behave right when the variable is set to ''.
  let config = process.env[variableName];

  // `process.env[variableName] ?? undefined`, on the other hand.
  if (typeof config !== 'string') {
    config = undefined;
  }

  const error =
    required && typeof config !== 'string'
      ? new Error(`${variableName} is not defined.`)
      : undefined;

  return {config, error};
}
