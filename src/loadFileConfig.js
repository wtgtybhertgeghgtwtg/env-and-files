// @flow
import {readFile} from 'fs';
import type {FileConfig} from './types';

export default function loadFileConfig(property: FileConfig) {
  const {encoding = 'utf8', filePath, required = false} = property;

  return new Promise<{error: false | ?Error, value: ?string}>(resolve =>
    readFile(filePath, encoding, (error, value) =>
      resolve({error: required && error, value: value ?? undefined}),
    ),
  );
}
