import isEnvironmentConfig from './is-environment-config';
import loadEnvironmentProperty from './load-environment-property';
import loadFileProperty from './load-file-property';
import {PropertyConfig, PropertyResult} from './types';

export default function loadProperty<Value>(
  propertyConfig: PropertyConfig<Value>,
  propertyName: string,
): PropertyResult<string | Value> | Promise<PropertyResult<string | Value>> {
  if (typeof propertyConfig === 'string') {
    return loadProperty({variableName: propertyConfig}, propertyName);
  }

  return isEnvironmentConfig(propertyConfig, propertyName)
    ? loadEnvironmentProperty(propertyConfig)
    : loadFileProperty(propertyConfig);
}
