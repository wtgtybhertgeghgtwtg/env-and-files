// @flow
/* eslint-disable no-use-before-define */

export type Config<CMap: ConfigMap> = $ObjMap<
  CMap,
  <GMap: ConfigGroup>(
    GMap,
  ) => $ObjMap<
    GMap,
    ((string | {required?: false, type?: 'string'}) => ?string) &
      (({required: true, type?: 'string'}) => string) &
      (({required?: false, type: 'number'}) => ?number) &
      (({required: true, type: 'number'}) => number),
  >,
>;

export type ConfigGroup = {
  // $FlowFixMe https://github.com/facebook/flow/issues/4196
  [property: string]: string | EnvironmentConfig | FileConfig,
};

export type ConfigMap = {
  [group: string]: ConfigGroup,
};

export type EnvironmentConfig = {|
  required?: boolean,
  type?: PropType,
  variableName: string,
|};

export type FileConfig = {|
  encoding?: buffer$Encoding,
  filePath: string,
  required?: boolean,
  type?: PropType,
|};

// This needs a better name.
export type PropType = 'number' | 'string';
