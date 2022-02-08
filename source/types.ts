/**
 * Configuration for a property that can be formatted.
 */
export interface BaseConfig<Value> {
  /**
   * The default value of this property.
   */
  defaultValue?: Value;

  /**
   * A function to format the raw value.
   */
  format?: PropertyFormatter<Value>;

  /**
   * Whether this property is required.
   * @defaultValue true
   */
  required?: boolean;
}

/**
 * Configuration for a property loaded from an environment variable.
 */
export interface EnvironmentConfig<Value> extends BaseConfig<Value> {
  /**
   * The name of the environment variable.
   */
  variableName: string;
}

/**
 * Configuration for a property loaded from a secret.
 */
export interface FileConfig<Value> extends BaseConfig<Value> {
  /**
   * The encoding of the file containing the secret.
   * @defaultValue 'utf8'
   */
  encoding?:
    | 'ascii'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'base64url'
    | 'latin1'
    | 'binary'
    | 'hex';

  /**
   * The path to the file containing the secret.
   */
  filePath: string;
}

/**
 * The configuration for loading a specific property.
 */
export type PropertyConfig<Value> =
  | string
  | EnvironmentConfig<Value>
  | FileConfig<Value>;

/**
 * A function to format a string property.
 */
export type PropertyFormatter<Value> = (raw: string) => Value;

/**
 * The result loading a property.
 * @internal
 */
export interface PropertyResult<Value> {
  /**
   * The error that was thrown, or false if there is none.
   */
  error: false | Error;

  /**
   * The value that was loaded, or undefined if it could not be loaded.
   */
  value: undefined | Value;
}

/**
 * Unwrap a config map to its resultant config.
 *
 * @typeParam ConfigMap - Type of the config map that will be passed to `loadConfig` or `loadConfigSync`.
 *
 * @remarks
 *
 * This type is exported for consumer use (e.g. a function that calls `load-config-sync` and returns the result), but is not actually used in this library.
 * While the implementation is identical to the return type of `load-config-sync` (or `load-config` but without the Promise), this type is not used there.
 * Currently, TypeScript, at least in VSCode, does not evaluate user-defined type aliases on hover, leading to a less clear user experience.
 * If this behavior is changed, this type should replace the inline implementations.
 */
export type UnwrapConfigMap<
  ConfigMap extends Record<string, PropertyConfig<unknown>>,
> = {[key in keyof ConfigMap]: UnwrapPropertyConfig<ConfigMap[key]>};

/**
 * Unwrap a property config to its resultant value.
 */
export type UnwrapPropertyConfig<PConfig extends PropertyConfig<unknown>> =
  PConfig extends string
    ? string
    : PConfig extends {required: false}
    ? UnwrapResult<PConfig> | undefined
    : UnwrapResult<PConfig>;

/**
 * Unwrap a result to its value.
 */
type UnwrapResult<PConfig extends PropertyConfig<unknown>> =
  PConfig extends BaseConfig<infer Value> ? Value : string;
