// @flow
/* eslint-disable no-redeclare */
import assert from 'assert';
import isobject from 'isobject';
import objectMap from 'object.map';
import pify from 'pify';
import ConfigError from './ConfigError';
import loadGroup from './loadGroup';
import resolveConfig from './resolveConfig';
import type {Config, ConfigMap} from './types';

const pifyResolveConfig = pify(resolveConfig);

declare function loadConfig<CMap: ConfigMap>(
  configMap: CMap,
): Promise<Config<CMap>>;
declare function loadConfig<CMap: ConfigMap>(
  configMap: CMap,
  callback: (error: ?ConfigError, config: Config<CMap>) => void,
): void;

export default function loadConfig<CMap: ConfigMap>(
  configMap: CMap,
  callback?: (error: ?ConfigError, config: Config<CMap>) => void,
) {
  assert(isobject(configMap), '"configMap" must be a ConfigMap object.');
  assert(
    typeof callback === 'undefined' || typeof callback === 'function',
    '"callback" must be a function or undefined.',
  );
  const mappedObject = objectMap(configMap, loadGroup);
  return callback
    ? resolveConfig(mappedObject, callback)
    : pifyResolveConfig(mappedObject);
}
