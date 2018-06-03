// @flow
/* eslint-disable no-undef */
import loadEnvironmentConfig from './loadEnvironmentConfig';
import loadFileConfig from './loadFileConfig';
import type {EnvironmentConfig, FileConfig} from './types';

export default function loadProperty(
  property: string | (EnvironmentConfig & FileConfig),
  propertyName: string,
  groupName: string,
) {
  if (typeof property === 'string') {
    return Promise.resolve(loadEnvironmentConfig({variableName: property}));
  }
  // $FlowFixMe
  const isEnvConfig = typeof property?.variableName === 'string';
  // $FlowFixMe
  const isFileConfig = typeof property?.filePath === 'string';
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
  const {type = 'string'} = property;
  if (!['number', 'string'].includes(type)) {
    return Promise.reject(
      new Error(
        `"configMap.${groupName}.${propertyName}.type" must be 'number', 'string', or undefined.`,
      ),
    );
  }
  return Promise.resolve(
    isEnvConfig ? loadEnvironmentConfig(property) : loadFileConfig(property),
  ).then(result => {
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
  });
}
