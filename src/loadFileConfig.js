// @flow
import {readFile} from 'fs';
import pify from 'pify';
import type {FileConfig} from './types';

const readFileAsync: (
  filePath: string,
  encoding: string,
) => Promise<?string> = pify(readFile);

export default function loadFileConfig(property: FileConfig) {
  const {
    defaultValue = null,
    encoding = 'utf8',
    filePath,
    required = false,
  } = property;

  // $FlowFixMe
  return readFileAsync(filePath, encoding).then(
    config => ({config, error: null}),
    (error: Error) =>
      required && defaultValue === null
        ? {config: null, error}
        : {config: defaultValue, error: null},
  );
}
