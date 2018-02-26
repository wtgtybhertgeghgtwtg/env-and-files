// @flow
/* eslint-disable no-use-before-define */

export type ConfigGroup = {
  [key: string]: string | EnvironmentConfig | FileConfig,
};

export type ConfigMap = {
  [group: string]: ConfigGroup,
};

export type ConfigResult<Config> = {
  config: Config,
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
