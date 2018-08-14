// @flow
export default function parseProperty(
  result: {error?: ?(false | Error), value?: ?string},
  type: string,
  groupName: string,
  propertyName: string,
) {
  if (type === 'string' || typeof result.value === 'undefined') {
    return result;
  }
  const value = parseInt(result.value, 10);
  const error =
    Number.isNaN(value) &&
    new Error(
      `The value for "configMap.${groupName}.${propertyName}" was defined, but could not be coerced to a number.`,
    );
  return {error, value};
}
