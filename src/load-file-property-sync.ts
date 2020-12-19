import {readFileSync} from 'fs';
import formatProperty from './format-property';
import {FileConfig, PropertyResult} from './types';

function tryToReadFile(
  propertyConfig: FileConfig<unknown>,
): PropertyResult<string> {
  const {encoding = 'utf8', filePath} = propertyConfig;
  try {
    return {error: false, value: readFileSync(filePath, encoding)};
  } catch (error) {
    return {error: error, value: undefined};
  }
}

export default function loadFilePropertySync<Value>(
  propertyConfig: FileConfig<Value>,
): PropertyResult<string | Value> {
  return formatProperty(tryToReadFile(propertyConfig), propertyConfig);
}
