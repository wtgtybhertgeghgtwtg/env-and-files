// @flow
import arrFlatten from 'arr-flatten';
import collectionMap from 'collection-map';
import objectMap from 'object.map';
import pProps from 'p-props';
import ConfigError from './ConfigError';
import type {ConfigCallback, ConfigMap, LoadedConfig} from './types';

export default function resolveConfig<CMap: ConfigMap>(
  loadedConfig: LoadedConfig<CMap>,
  callback: ConfigCallback<CMap>,
) {
  pProps(loadedConfig).then(result => {
    const config = objectMap(result, prop => prop.config);
    const errors = arrFlatten(collectionMap(result, prop => prop.errors));
    const error = errors.length > 0 ? new ConfigError(errors) : null;
    callback(error, config);
  });
}
