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
  encoding?: BufferEncoding;

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
 * Unwrap a property config to its resultant value.
 */
export type UnwrapPropertyConfig<
  PConfig extends PropertyConfig<unknown>
> = PConfig extends string
  ? string
  : PConfig extends {required: false}
  ? UnwrapResult<PConfig> | undefined
  : UnwrapResult<PConfig>;

/**
 * Unwrap a result to its value.
 */
type UnwrapResult<
  PConfig extends PropertyConfig<unknown>
> = PConfig extends BaseConfig<infer Value> ? Value : string;
