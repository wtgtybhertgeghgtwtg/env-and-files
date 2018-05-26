// @flow
/* eslint-disable no-use-before-define */

export type Config<CMap: ConfigMap> = $ObjMap<
  CMap,
  <GMap: ConfigGroup>(
    GMap,
  ) => $ObjMap<
    GMap,
    ((string | {required?: false}) => ?string) & (({required: true}) => string),
  >,
>;

export type ConfigGroup = {
  // $FlowFixMe
  [property: string]: string | EnvironmentConfig | FileConfig,
};

export type ConfigMap = {
  [group: string]: ConfigGroup,
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
