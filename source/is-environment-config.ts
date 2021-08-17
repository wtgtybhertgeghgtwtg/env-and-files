import {EnvironmentConfig, FileConfig} from './types';

export default function isEnvironmentConfig(
  propertyConfig: EnvironmentConfig<unknown> | FileConfig<unknown>,
  propertyName: string,
): propertyConfig is EnvironmentConfig<unknown> {
  const isEnvironmentConfig = 'variableName' in propertyConfig;
  const isFileConfig = 'filePath' in propertyConfig;
  if (!(isEnvironmentConfig || isFileConfig)) {
    throw new Error(
      `"configMap.${propertyName}" must be a string, EnvironmentConfig object, or FileConfig object.  Neither "filePath" nor "variableName" are defined.`,
    );
  }

  if (isEnvironmentConfig && isFileConfig) {
    throw new Error(
      `Cannot determine whether "configMap.${propertyName}" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.`,
    );
  }

  return isEnvironmentConfig;
}
