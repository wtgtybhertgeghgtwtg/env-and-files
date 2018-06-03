// @flow
import {readFile} from 'fs';
import type {FileConfig} from './types';

export default function loadFileConfig(property: FileConfig) {
  const {encoding = 'utf8', filePath, required = false} = property;

  return new Promise(resolve =>
    readFile(filePath, encoding, (error, value) =>
      resolve({
        error: required && error,
        // value: value ?? undefined,
        value: typeof value === 'string' ? value : undefined,
      }),
    ),
  );
}
