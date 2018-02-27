// @flow
/* eslint-disable no-use-before-define */

export type Config<CMap: ConfigMap> = $ObjMap<
  CMap,
  <GMap: ConfigGroup>(GMap) => $ObjMap<GMap, () => ?string>,
>;

export type ConfigGroup = {
  [key: string]: string | EnvironmentConfig | FileConfig,
};

export type ConfigMap = {
  [group: string]: ConfigGroup,
};

export type ConfigResult<CMap: ConfigMap> = {
  config: Config<CMap>,
  error?: Error,
};

export type EnvironmentConfig = {
  defaultValue?: string,
  required?: boolean,
  variableName: string,
};

export type FileConfig = {
  defaultValue?: string,
  encoding?: buffer$Encoding,
  filePath: string,
  required?: boolean,
};
