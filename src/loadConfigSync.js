// @flow
import arrFlatten from 'arr-flatten';
import assert from 'assert';
import collectionMap from 'collection-map';
import isobject from 'isobject';
import objectMap from 'object.map';
import ConfigError from './ConfigError';
import loadPropertySync from './loadPropertySync';
import type {Config, ConfigMap} from './types';

export default function loadConfigSync<CMap: ConfigMap>(
  configMap: CMap,
): Config<CMap> {
  assert(isobject(configMap), '"configMap" must be a ConfigMap object.');
  const groups = objectMap(configMap, (group, groupName) => {
    assert(
      isobject(group),
      `"configMap.${groupName}" must be a ConfigGroup object.`,
    );
    const props = objectMap(group, (prop, propName) =>
      loadPropertySync(prop, propName, groupName),
    );
    return {
      config: objectMap(props, prop => prop.config),
      errors: collectionMap(props, prop => prop.error).filter(error => error),
    };
  });
  const config = objectMap(groups, group => group.config);
  const errors = arrFlatten(collectionMap(groups, group => group.errors));
  if (errors.length > 0) {
    throw new ConfigError(errors);
  }
  return config;
}
