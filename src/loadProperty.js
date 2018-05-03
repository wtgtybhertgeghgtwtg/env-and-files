// @flow
import isobject from 'isobject';
import loadEnvironmentConfig from './loadEnvironmentConfig';
import loadFileConfig from './loadFileConfig';
import type {EnvironmentConfig, FileConfig} from './types';

export default function loadProperty(
  property: string | EnvironmentConfig | FileConfig,
  propertyName: string,
  groupName: string,
) {
  if (typeof property === 'string') {
    return Promise.resolve(loadEnvironmentConfig({variableName: property}));
  }
  const propertyIsObject = isobject(property);
  const isEnvConfig =
    // $FlowFixMe
    propertyIsObject && typeof property.variableName === 'string';
  const isFileConfig =
    // $FlowFixMe
    propertyIsObject && typeof property.filePath === 'string';
  if (!(isEnvConfig || isFileConfig)) {
    return Promise.reject(
      new Error(
        `"configMap.${groupName}.${propertyName}" must be a string, EnvironmentConfig object, or FileConfig object.`,
      ),
    );
  }
  if (isEnvConfig && isFileConfig) {
    return Promise.reject(
      new Error(
        `Cannot determine whether "configMap.${groupName}.${propertyName}" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.`,
      ),
    );
  }
  return isEnvConfig
    ? // $FlowFixMe
      Promise.resolve(loadEnvironmentConfig(property))
    : // $FlowFixMe
      loadFileConfig(property);
}
