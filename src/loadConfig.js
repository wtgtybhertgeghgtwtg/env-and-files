// @flow
/* eslint-disable consistent-return */
import arrFlatten from 'arr-flatten';
import assert from 'assert';
import collectionMap from 'collection-map';
import isobject from 'isobject';
import objectMap from 'object.map';
import pProps from 'p-props';
import {fromCallback} from 'universalify';
import ConfigError from './ConfigError';
import loadProperty from './loadProperty';
import type {Config, ConfigMap} from './types';

type LoadConfigCallback<CMap: ConfigMap> = (
  error: ?ConfigError,
  config: Config<CMap>,
) => void;

type CallbackInterface = <CMap: ConfigMap>(
  configMap: CMap,
  callback: LoadConfigCallback<CMap>,
) => void;

type PromiseInterface = <CMap: ConfigMap>(
  configMap: CMap,
) => Promise<Config<CMap>>;

export default (fromCallback(
  <CMap: ConfigMap>(configMap: CMap, callback: LoadConfigCallback<CMap>) => {
    if (!isobject(configMap)) {
      const error = new Error('"configMap" must be a ConfigMap object.');
      // return typeof callback === 'function' ? callback(error, null) : throw error;
      if (typeof callback !== 'function') {
        throw error;
      }
      // $FlowFixMe Since this only happens if they do not follow the type contract.
      return callback(error, null);
    }
    assert(
      typeof callback === 'function',
      '"callback" must be a function or undefined.',
    );
    pProps(configMap, (group, groupName) => {
      if (!isobject(group)) {
        return Promise.reject(
          new Error(`"configMap.${groupName}" must be a ConfigGroup object.`),
        );
      }
      return pProps(group, (property, propertyName) =>
        loadProperty(property, propertyName, groupName),
      ).then(result => ({
        config: objectMap(result, prop => prop.config),
        errors: collectionMap(result, prop => prop.error).filter(
          error => error,
        ),
      }));
    }).then(
      result => {
        const config = objectMap(result, prop => prop.config);
        const errors = arrFlatten(collectionMap(result, prop => prop.errors));
        const error = errors.length > 0 ? new ConfigError(errors) : null;
        callback(error, config);
      },
      // $FlowFixMe Type contract.
      error => callback(error, null),
    );
  },
): CallbackInterface & PromiseInterface);
