// @flow
import assert from 'assert';
import collectionMap from 'collection-map';
import isobject from 'isobject';
import objectMap from 'object.map';
import pProps from 'p-props';
import loadProperty from './loadProperty';
import type {ConfigGroup} from './types';

export default function loadGroup<GMap: ConfigGroup>(
  group: GMap,
  groupName: string,
) {
  assert(
    isobject(group),
    `"configMap.${groupName}" must be a ConfigGroup object.`,
  );
  const mappedObject = objectMap(group, (property, propertyName) =>
    loadProperty(property, propertyName, groupName),
  );
  return pProps(mappedObject).then(result => {
    const config = objectMap(result, prop => prop.config);
    const errors = collectionMap(result, prop => prop.error).filter(
      error => error,
    );
    return {config, errors};
  });
}
