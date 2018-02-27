// @flow
import arrFlatten from 'arr-flatten';
import assert from 'assert';
import collectionMap from 'collection-map';
import isobject from 'isobject';
import objectMap from 'object.map';
import pProps from 'p-props';
import ConfigError from './ConfigError';
import loadGroup from './loadGroup';
import type {ConfigGroup, ConfigMap} from './types';

type ExtractConfig = <GMap: ConfigGroup>(GMap) => $ObjMap<GMap, () => ?string>;
export type Config<CMap: ConfigMap> = $ObjMap<CMap, ExtractConfig>;

export default function loadConfig<CMap: ConfigMap>(
  configMap: CMap,
): Promise<Config<CMap>> {
  assert(isobject(configMap), '"configMap" must be a ConfigMap object.');
  const mappedObject = objectMap(configMap, loadGroup);
  return pProps(mappedObject).then(result => {
    const config = objectMap(result, prop => prop.config);
    const errors = arrFlatten(collectionMap(result, prop => prop.errors));
    if (errors.length === 0) {
      return config;
    }
    const error = new ConfigError(config, errors);
    return Promise.reject(error);
  });
}
