import ConfigError from './config-error';
import loadProperty from './load-property';
import {PropertyConfig, UnwrapPropertyConfig} from './types';

/**
 * Load configuration asynchronously.
 *
 * @example
 * ```
 * const config = await loadConfig({
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
 * @returns A Promise that resolves to the loaded configuration object.
 *
 * @throws {@link ConfigError}
 * Rejects if one or more configuration properties was not able to load properly.
 */
export default async function loadConfig<
  ConfigMap extends Record<string, PropertyConfig<unknown>>,
>(
  configMap: ConfigMap,
): Promise<{[key in keyof ConfigMap]: UnwrapPropertyConfig<ConfigMap[key]>}> {
  const errorMap = new Map<string, Error>();
  const resultEntries = await Promise.all(
    Object.entries(configMap).map(async ([propertyName, propertyConfig]) => {
      const {error, value} = await loadProperty(propertyConfig, propertyName);
      if (error !== false) {
        errorMap.set(propertyName as string, error);
      }

      return [propertyName, value];
    }),
  );

  if (errorMap.size > 0) {
    const errors = Object.fromEntries(errorMap);
    throw new ConfigError(errors);
  }

  return Object.fromEntries(resultEntries);
}
