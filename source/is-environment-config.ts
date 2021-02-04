import assert from 'assert';
import {EnvironmentConfig, FileConfig} from './types';

/**
 * Determine whether a PropertyConfig is an EnvironmentConfig.
 *
 * @param propertyConfig - The PropertyConfig that may be an EnvironmentConfig.
 * @param propertyName - The name of the property.
 * @returns True if the PropertyConfig is an EnvironmentConfig.
 */
export default function isEnvironmentConfig(
  propertyConfig: EnvironmentConfig<unknown> | FileConfig<unknown>,
  propertyName: string,
): propertyConfig is EnvironmentConfig<unknown> {
  const isEnvironmentConfig = 'variableName' in propertyConfig;
  const isFileConfig = 'filePath' in propertyConfig;
  assert(
    isEnvironmentConfig || isFileConfig,
    `"configMap.${propertyName}" must be a string, EnvironmentConfig object, or FileConfig object.  Neither "filePath" nor "variableName" are defined.`,
  );
  assert(
    !(isEnvironmentConfig && isFileConfig),
    `Cannot determine whether "configMap.${propertyName}" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.`,
  );
  return isEnvironmentConfig;
}
