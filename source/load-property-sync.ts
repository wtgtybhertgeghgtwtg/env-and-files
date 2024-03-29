import isEnvironmentConfig from './is-environment-config';
import loadEnvironmentProperty from './load-environment-property';
import loadFilePropertySync from './load-file-property-sync';
import {PropertyConfig, PropertyResult} from './types';

export default function loadPropertySync<Value>(
  propertyConfig: PropertyConfig<Value>,
  propertyName: string,
): PropertyResult<string | Value> {
  if (typeof propertyConfig === 'string') {
    return loadPropertySync({variableName: propertyConfig}, propertyName);
  }

  return isEnvironmentConfig(propertyConfig, propertyName)
    ? loadEnvironmentProperty(propertyConfig)
    : loadFilePropertySync(propertyConfig);
}
