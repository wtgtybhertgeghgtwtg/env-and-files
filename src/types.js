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
  required?: boolean,
  variableName: string,
};

export type FileConfig = {
  encoding?: buffer$Encoding,
  filePath: string,
  required?: boolean,
};
