// @flow
/* eslint-disable no-use-before-define */
import type ConfigError from './ConfigError';

export type Config<CMap: ConfigMap> = $ObjMap<
  CMap,
  <GMap: ConfigGroup>(GMap) => $ObjMap<GMap, () => string | void>,
>;

export type ConfigCallback<CMap: ConfigMap> = (
  error: ?ConfigError,
  config: Config<CMap>,
) => void;

export type ConfigGroup = $Subtype<{
  +[property: string]: string | EnvironmentConfig | FileConfig,
}>;

export type ConfigMap = {
  [group: string]: ConfigGroup,
};

export type ConfigResult = {
  config: string | void,
  error: ?Error,
};

export type EnvironmentConfig = {|
  required?: boolean,
  variableName: string,
|};

export type FileConfig = {|
  encoding?: buffer$Encoding,
  filePath: string,
  required?: boolean,
|};

export type LoadedConfig<CMap: ConfigMap> = $ObjMap<
  CMap,
  <GMap: ConfigGroup>(
    GMap,
  ) => $ObjMap<GMap, () => ConfigResult | Promise<ConfigResult>>,
>;
