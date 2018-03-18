// @flow
import {readFile} from 'fs';
import type {FileConfig} from './types';

export default function loadFileConfig(property: FileConfig) {
  const {encoding = 'utf8', filePath, required = false} = property;

  // $FlowFixMe
  return new Promise(resolve =>
    readFile(filePath, encoding, (error, config) =>
      resolve({
        // config: config ?? undefined,
        config: typeof config === 'string' ? config : undefined,
        error: error && required ? error : null,
      }),
    ),
  );
}
