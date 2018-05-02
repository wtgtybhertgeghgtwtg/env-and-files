// @flow
import assert from 'assert';
import isobject from 'isobject';
import loadEnvironmentConfig from './loadEnvironmentConfig';
import loadFileConfigSync from './loadFileConfigSync';
import type {ConfigResult, EnvironmentConfig, FileConfig} from './types';

export default function loadPropertySync(
  property: string | EnvironmentConfig | FileConfig,
  propertyName: string,
  groupName: string,
): ConfigResult {
  if (typeof property === 'string') {
    return loadEnvironmentConfig({variableName: property});
  }
  const propertyIsObject = isobject(property);
  const isEnvConfig =
    // $FlowFixMe
    propertyIsObject && typeof property.variableName === 'string';
  const isFileConfig =
    // $FlowFixMe
    propertyIsObject && typeof property.filePath === 'string';
  assert(
    isEnvConfig || isFileConfig,
    `"configMap.${groupName}.${propertyName}" must be a string, EnvironmentConfig object, or FileConfig object.`,
  );
  assert(
    !(isEnvConfig && isFileConfig),
    `Cannot determine whether "configMap.${groupName}.${propertyName}" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.`,
  );
  return isEnvConfig
    ? // $FlowFixMe
      loadEnvironmentConfig(property)
    : // $FlowFixMe
      loadFileConfigSync(property);
}
