// @flow
import assert from 'assert';
import loadEnvironmentConfig from './loadEnvironmentConfig';
import loadFileConfigSync from './loadFileConfigSync';
import parseProperty from './parseProperty';
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
  return parseProperty(result, type, groupName, propertyName);
}
