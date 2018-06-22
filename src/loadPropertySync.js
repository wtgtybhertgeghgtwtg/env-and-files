// @flow
import assert from 'assert';
import loadEnvironmentConfig from './loadEnvironmentConfig';
import loadFileConfigSync from './loadFileConfigSync';
import type {EnvironmentConfig, FileConfig} from './types';

export default function loadPropertySync(
  property: string | (EnvironmentConfig & FileConfig),
  propertyName: string,
  groupName: string,
) {
  if (typeof property === 'string') {
    return loadEnvironmentConfig({variableName: property});
  }
  // $FlowFixMe
  const isEnvConfig = typeof property?.variableName === 'string';
  // $FlowFixMe
  const isFileConfig = typeof property?.filePath === 'string';
  assert(
    isEnvConfig || isFileConfig,
    `"configMap.${groupName}.${propertyName}" must be a string, EnvironmentConfig object, or FileConfig object.`,
  );
  assert(
    !(isEnvConfig && isFileConfig),
    `Cannot determine whether "configMap.${groupName}.${propertyName}" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.`,
  );
  const {type = 'string'} = property;
  assert(
    ['number', 'string'].includes(type),
    `"configMap.${groupName}.${propertyName}.type" must be 'number', 'string', or undefined.`,
  );
  const result = isEnvConfig
    ? loadEnvironmentConfig(property)
    : loadFileConfigSync(property);
  if (type === 'string' || typeof result.value === 'undefined') {
    return result;
  }
  const value = parseInt(result.value, 10);
  const error =
    Number.isNaN(value) &&
    new Error(
      `The value for "configMap.${groupName}.${propertyName}" was defined, but could not be coerced to a number.`,
    );
  return {error, value};
}
