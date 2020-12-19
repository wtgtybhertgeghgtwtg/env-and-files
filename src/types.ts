/**
 * Configuration for a property that can be formatted.
 */
export interface FormattableConfig<Value> {
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
  required?: true;
}

/**
 * Configuration for a property that can be required.
 */
export interface RequirableConfig {
  /**
   * Whether this property is required.
   * @defaultValue true
   */
  required?: boolean;
}

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
 * Configuration for a property loaded from an environment variable.
 */
export type EnvironmentConfig<Value> =
  | (BaseEnvironmentConfig & FormattableConfig<Value>)
  | (BaseEnvironmentConfig & RequirableConfig);

/**
 * Configuration for a property loaded from a secret.
 */
export type FileConfig<Value> =
  | (BaseFileConfig & FormattableConfig<Value>)
  | (BaseFileConfig & RequirableConfig);

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
 * Unwrap a property config to its resultant value.
 */
export type UnwrapPropertyConfig<
  PConfig extends PropertyConfig<unknown>
> = PConfig extends string
  ? string
  : PConfig extends {required: false}
  ? UnwrapResult<PConfig> | void
  : UnwrapResult<PConfig>;

/**
 * Base configuration for a property loaded from an environment variable.
 */
interface BaseEnvironmentConfig {
  /**
   * The name of the environment variable.
   */
  variableName: string;
}

/**
 * Base configuration for a property loaded from a secret.
 */
interface BaseFileConfig {
  /**
   * The encoding of the file containing the secret.
   * @defaultValue 'utf8'
   */
  encoding?: BufferEncoding;

  /**
   * The path to the file containing the secret.
   */
  filePath: string;
}

/**
 * Unwrap a result to its value.
 */
type UnwrapResult<
  PConfig extends PropertyConfig<unknown>
> = PConfig extends FormattableConfig<infer Value> ? Value : string;
