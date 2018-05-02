// @flow
import {readFileSync} from 'fs';
import type {FileConfig} from './types';

export default function loadFileConfigSync(property: FileConfig) {
  const {encoding = 'utf8', filePath, required = false} = property;
  try {
    const config = readFileSync(filePath, encoding);
    return {config, error: undefined};
  } catch (error) {
    return {config: undefined, error: required ? error : undefined};
  }
}
