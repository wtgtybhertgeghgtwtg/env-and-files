import {BaseConfig, PropertyFormatter, PropertyResult} from './types';

function tryToFormat<Value>(
  value: string,
  formatter: PropertyFormatter<Value>,
): PropertyResult<Value> {
  try {
    return {error: false, value: formatter(value)};
  } catch (error) {
    return {error, value: undefined};
  }
}

export default function something<Value>(
  propertyResult: PropertyResult<string>,
  propertyConfig: BaseConfig<Value>,
): PropertyResult<string | Value> {
  const {defaultValue, format, required = true} = propertyConfig;
  const hasDefaultValue = typeof defaultValue !== 'undefined';
  const hasError = propertyResult.error !== false;
  const hasFormat = typeof format !== 'undefined';
  const hasValue = typeof propertyResult.value !== 'undefined';

  if (hasError ? required && !hasDefaultValue : hasValue && !hasFormat) {
    return propertyResult;
  }

  return hasValue && hasFormat
    ? tryToFormat(
        propertyResult.value as string,
        format as PropertyFormatter<Value>,
      )
    : {error: false, value: defaultValue};
}
