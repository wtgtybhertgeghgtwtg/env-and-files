import {readFile} from 'fs';
import formatProperty from './format-property';
import {FileConfig, PropertyResult} from './types';

export default function loadFileProperty<Value>(
  propertyConfig: FileConfig<Value>,
): Promise<PropertyResult<string | Value>> {
  const {encoding = 'utf8', filePath} = propertyConfig;
  return new Promise((resolve) => {
    readFile(filePath, encoding, (error, value) => {
      resolve(formatProperty({error: error ?? false, value}, propertyConfig));
    });
  });
}
