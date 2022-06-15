import formatProperty from './format-property';
import {EnvironmentConfig, PropertyResult} from './types';

export default function loadEnvironmentProperty<Value>(
  propertyConfig: EnvironmentConfig<Value>,
): PropertyResult<string | Value> {
  const {variableName} = propertyConfig;
  const value = process.env[variableName];
  return formatProperty(
    {
      error:
        typeof value === 'undefined' &&
        new Error(`${variableName} is not defined.`),
      value,
    },
    propertyConfig,
  );
}
