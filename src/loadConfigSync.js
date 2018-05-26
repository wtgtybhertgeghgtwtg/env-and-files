// @flow
import assert from 'assert';
import isobject from 'isobject';
import objectMap from 'object.map';
import ConfigError from './ConfigError';
import loadPropertySync from './loadPropertySync';
import type {Config, ConfigMap} from './types';

export default function loadConfigSync<CMap: ConfigMap>(
  configMap: CMap,
): Config<CMap> {
  assert(isobject(configMap), '"configMap" must be a ConfigMap object.');
  const errors = [];
  const result = objectMap(configMap, (group, groupName) => {
    assert(
      isobject(group),
      `"configMap.${groupName}" must be a ConfigGroup object.`,
    );
    return objectMap(group, (prop, propName) => {
      const property = loadPropertySync(prop, propName, groupName);
      if (property.error) {
        errors.push(property.error);
      }
      return property.config;
    });
  });
  if (errors.length > 0) {
    throw new ConfigError(errors);
  }
  return result;
}
