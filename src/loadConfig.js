// @flow
import arrFlatten from 'arr-flatten';
import collectionMap from 'collection-map';
import isobject from 'isobject';
import objectMap from 'object.map';
import pProps from 'p-props';
import ConfigError from './ConfigError';
import loadProperty from './loadProperty';
import type {Config, ConfigMap} from './types';

export default function loadConfig<CMap: ConfigMap>(
  configMap: CMap,
): Promise<Config<CMap>> {
  if (!isobject(configMap)) {
    return Promise.reject(new Error('"configMap" must be a ConfigMap object.'));
  }
  return pProps(configMap, (group, groupName) => {
    if (!isobject(group)) {
      return Promise.reject(
        new Error(`"configMap.${groupName}" must be a ConfigGroup object.`),
      );
    }
    return pProps(group, (prop, propName) =>
      loadProperty(prop, propName, groupName),
    ).then(result => ({
      config: objectMap(result, prop => prop.config),
      errors: collectionMap(result, prop => prop.error).filter(error => error),
    }));
  }).then(result => {
    const config = objectMap(result, prop => prop.config);
    const errors = arrFlatten(collectionMap(result, prop => prop.errors));
    if (errors.length > 0) {
      throw new ConfigError(errors);
    }
    return config;
  });
}
