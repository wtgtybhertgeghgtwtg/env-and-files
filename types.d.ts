export interface ConfigDefinition {
  /**
   * Whether or not to throw if this property is not provided.
   *
   * @default false
   */
  required?: boolean;
  /**
   * The type to which the property will be coerced.
   *
   * @default 'string'
   */
  type?: PropType;
}

export interface ConfigGroup {
  /**
   * A description of from where a configurable property is to be loaded.
   */
  [property: string]: string | EnvironmentConfig | FileConfig;
}

export interface ConfigMap {
  /**
   * An object map describing a conceptual grouping of configuration.
   */
  [group: string]: ConfigGroup;
}

export interface EnvironmentConfig extends ConfigDefinition {
  /**
   * The name of the environment variable from which this property will be assigned.
   */
  variableName: string;
}

export interface FileConfig extends ConfigDefinition {
  /**
   * The encoding of the file.
   *
   * @default 'utf8'
   */
  encoding?:
    | 'ascii'
    | 'base64'
    | 'binary'
    | 'hex'
    | 'latin1'
    | 'ucs2'
    | 'utf16le'
    | 'utf8';
  /**
   * The path of the file from which this property will be assigned.
   */
  filePath: string;
}

/**
 * Get the type to which a property will be coerced.
 */
export type GetConfigType<
  Prop extends ConfigDefinition
> = Prop['type'] extends 'number' ? number : string;

/**
 * Get the type that will be returned for a  `ConfigDefinition`.
 */
export type ConfigType<
  Prop extends ConfigDefinition | string
> = Prop extends ConfigDefinition
  ? Prop['required'] extends true
    ? GetConfigType<Prop>
    : GetConfigType<Prop> | void
  : string | void;

/**
 * The type to which a property will be coerced.
 */
export type PropType = 'number' | 'string';

/**
 * Load configuration from environment variables or files.
 *
 * @param configMap - An object map describing groups of configuration to be loaded.
 * @returns A Promise resolving to an object map of configuration in the same shape as `configMap`.
 */
export function loadConfig<CMap extends ConfigMap>(
  configMap: CMap,
): Promise<
  {
    // The result isn't particularly intuitive for tooling if an alias is used.
    [group in keyof CMap]: {
      [property in keyof CMap[group]]: ConfigType<CMap[group][property]>
    }
  }
>;

/**
 * Load configuration from environment variables or files, synchronously.
 *
 * @param configMap - An object map describing groups of configuration to be loaded.
 * @returns An object map of configuration in the same shape as `configMap`.
 */
export function loadConfigSync<CMap extends ConfigMap>(
  configMap: CMap,
): {
  [group in keyof CMap]: {
    [property in keyof CMap[group]]: ConfigType<CMap[group][property]>
  }
};
