import ConfigError from './config-error';
import loadPropertySync from './load-property-sync';
import {PropertyConfig, UnwrapPropertyConfig} from './types';

/**
 * Load configuration synchronously.
 *
 * @example
 * ```
 * const config = loadConfigSync({
 *   postgresPassword: {
 *     filePath: '/secrets/password',
 *   },
 *   postgresUrl: {
 *     format: (value) => new URL(value),
 *     variableName: 'POSTGRES_URL'
 *   },
 *   postgresUsername: {
 *     defaultValue: 'postgres',
 *     filePath: '/secrets/username',
 *   },
 * });
 *
 * assert(typeof config.postgresPassword === 'string');
 * assert(config.postgresUrl instanceof URL);
 * assert(typeof config.postgresUsername === 'string');
 * ```
 *
 * @param configMap - An object map of configuration properties and how they should be loaded.
 * @returns The loaded configuration object.
 *
 * @throws {@link ConfigError}
 * Thrown if one or more configuration properties was not able to load properly.
 */
export default function loadConfigSync<
  ConfigMap extends Record<string, PropertyConfig<unknown>>
>(
  configMap: ConfigMap,
): {[key in keyof ConfigMap]: UnwrapPropertyConfig<ConfigMap[key]>} {
  const errorMap = new Map<string, Error>();
  const result = {} as {
    [key in keyof ConfigMap]: UnwrapPropertyConfig<ConfigMap[key]>;
  };
  for (const [propertyName, propertyConfig] of Object.entries(configMap) as [
    string & keyof ConfigMap,
    ConfigMap[keyof ConfigMap],
  ][]) {
    const {error, value} = loadPropertySync(propertyConfig, propertyName);
    if (error !== false) {
      errorMap.set(propertyName, error);
    }
    result[propertyName] = value as UnwrapPropertyConfig<
      ConfigMap[keyof ConfigMap]
    >;
  }

  if (errorMap.size > 0) {
    const errors = Object.fromEntries(errorMap);
    throw new ConfigError(errors);
  }

  return result;
}
