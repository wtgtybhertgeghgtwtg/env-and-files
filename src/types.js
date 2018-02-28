// @flow
/* eslint-disable no-use-before-define */
import type ConfigError from './ConfigError';

export type Config<CMap: ConfigMap> = $ObjMap<
  CMap,
  <GMap: ConfigGroup>(GMap) => $ObjMap<GMap, () => ?string>,
>;

export type ConfigCallback<CMap: ConfigMap> = (
  error: ?ConfigError<CMap>,
  config: Config<CMap>,
) => void;

export type ConfigGroup = {
  [property: string]: string | EnvironmentConfig | FileConfig,
};

export type ConfigMap = {
  [group: string]: ConfigGroup,
};

export type ConfigResult = {
  config: ?string,
  error: ?Error,
};

export type EnvironmentConfig = {
  required?: boolean,
  variableName: string,
};

export type FileConfig = {
  encoding?: buffer$Encoding,
  filePath: string,
  required?: boolean,
};

export type LoadedConfig<CMap: ConfigMap> = $ObjMap<
  CMap,
  <GMap: ConfigGroup>(
    GMap,
  ) => $ObjMap<GMap, () => ConfigResult | Promise<ConfigResult>>,
>;
