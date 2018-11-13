// @flow
import {readFileSync} from 'fs';
import type {FileConfig} from './types';

export default function loadFileConfigSync(property: FileConfig) {
  const {encoding = 'utf8', filePath, required = false} = property;
  try {
    const value = readFileSync(filePath, encoding);
    return {value};
  } catch (error) {
    return {error: required && error};
  }
}
