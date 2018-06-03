// @flow
import isobject from 'isobject';
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
  const errors = [];
  return pProps(configMap, (group, groupName) => {
    if (!isobject(group)) {
      return Promise.reject(
        new Error(`"configMap.${groupName}" must be a ConfigGroup object.`),
      );
    }
    return pProps(group, (prop, propName) =>
      loadProperty(prop, propName, groupName).then(({error, value}) => {
        if (error) {
          errors.push(error);
        }
        return value;
      }),
    );
  }).then(result => {
    if (errors.length > 0) {
      throw new ConfigError(errors);
    }
    return result;
  });
}
