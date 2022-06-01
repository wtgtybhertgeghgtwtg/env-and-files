import {readFile} from 'fs/promises';
import formatProperty from './format-property';
import {FileConfig, PropertyResult} from './types';

async function tryToReadFile(
  propertyConfig: FileConfig<unknown>,
): Promise<PropertyResult<string>> {
  const {encoding = 'utf8', filePath} = propertyConfig;
  try {
    return {error: false, value: await readFile(filePath, encoding)};
  } catch (error) {
    return {error: error as Error, value: undefined};
  }
}

export default async function loadFileProperty<Value>(
  propertyConfig: FileConfig<Value>,
): Promise<PropertyResult<string | Value>> {
  return formatProperty(await tryToReadFile(propertyConfig), propertyConfig);
}
