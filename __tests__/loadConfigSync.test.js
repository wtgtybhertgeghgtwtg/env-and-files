// @flow
import fs from 'fs';
import {loadConfigSync, type ConfigError} from '../src';

jest.mock('fs');

describe('loadConfig', () => {
  it('can load empty groups', () => {
    const config = loadConfigSync({groupOne: {}});

    expect(config.groupOne).toEqual({});
  });

  describe('invariants', () => {
    it.each([undefined, 'not an object', null])(
      'throws if "configMap" is %s.',
      configMap => {
        expect(() => loadConfigSync(configMap)).toThrow(
          '"configMap" must be a ConfigMap object.',
        );
      },
    );

    it.each`
      type               | groupOne
      ${'not an object'} | ${3}
      ${'null'}          | ${null}
    `('throws if a property of "configMap" is $type.', ({groupOne}) => {
      expect(() => loadConfigSync({groupOne})).toThrow(
        '"configMap.groupOne" must be a ConfigGroup object.',
      );
    });

    it.each`
      type                                                      | propOne
      ${'neither a string nor an object'}                       | ${3}
      ${'null'}                                                 | ${null}
      ${'an object with neither "filePath" nor "variableName"'} | ${{}}
    `(
      'throws if a property of a property of "configMap" is $type.',
      ({propOne}) => {
        expect(() => loadConfigSync({groupOne: {propOne}})).toThrow(
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        );
      },
    );

    it('throws if a property of a property of "configMap" is an object with both "filePath" and "variableName" defined.', () => {
      expect(() =>
        loadConfigSync({
          groupOne: {
            propOne: {filePath: '/prop.one', variableName: 'PROP_ONE'},
          },
        }),
      ).toThrow(
        'Cannot determine whether "configMap.groupOne.propOne" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.',
      );
    });
  });

  describe('loading environmental variables', () => {
    const variableName = 'PROP_ONE';

    describe('when the environmental variable is present', () => {
      const variableValue = 'The first property.';

      beforeEach(() => {
        process.env[variableName] = variableValue;
      });

      it('equals the environmental variable.', () => {
        const config = loadConfigSync({
          groupOne: {propOne: {variableName}},
        });

        expect(config.groupOne.propOne).toEqual(variableValue);
      });

      it('equals the environmental variable (using shorthand syntax).', () => {
        const config = loadConfigSync({
          groupOne: {propOne: variableName},
        });

        expect(config.groupOne.propOne).toEqual(variableValue);
      });
    });

    describe('when the environmental variable is not present', () => {
      beforeEach(() => {
        delete process.env[variableName];
      });

      it('is undefined.', () => {
        const config = loadConfigSync({
          groupOne: {propOne: {variableName}},
        });

        expect(config.groupOne.propOne).toBeUndefined();
      });

      it('is undefined if using shorthand syntax.', () => {
        const config = loadConfigSync({
          groupOne: {propOne: variableName},
        });

        expect(config.groupOne.propOne).toBeUndefined();
      });

      it('throws if required.', () => {
        let error: ConfigError;
        try {
          loadConfigSync({
            groupOne: {propOne: {required: true, variableName}},
          });
        } catch (err) {
          error = err;
        }
        // $FlowFixMe
        expect(error.message).toEqual('Configuration could not be loaded.');

        // $FlowFixMe
        const {errors} = error;
        expect(errors.length).toBe(1);
        expect(errors[0].message).toEqual('PROP_ONE is not defined.');
      });
    });
  });

  describe('loading files', () => {
    const filePath = '/prop.one';

    describe('when the file is present', () => {
      const fileContent = 'The first property.';

      it('equals the file content decoded as UTF-8 if no encoding is defined.', () => {
        // $FlowFixMe
        fs.__setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const config = loadConfigSync({
          groupOne: {propOne: {filePath}},
        });

        expect(config.groupOne.propOne).toEqual(fileContent);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
      });

      it('equals the file content decoded using the given encoding, if defined.', () => {
        // $FlowFixMe
        fs.__setFiles({[filePath]: Buffer.from(fileContent, 'ascii')});

        const config = loadConfigSync({
          groupOne: {propOne: {encoding: 'ascii', filePath}},
        });

        expect(config.groupOne.propOne).toEqual(fileContent);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'ascii');
      });
    });

    describe('when the file is not present', () => {
      beforeEach(() => {
        // $FlowFixMe
        fs.__setFiles({});
      });

      it('is undefined.', () => {
        const config = loadConfigSync({
          groupOne: {propOne: {filePath}},
        });

        expect(config.groupOne.propOne).toBeUndefined();
      });

      it('throws if required.', () => {
        let error: ConfigError;
        try {
          loadConfigSync({
            groupOne: {propOne: {filePath, required: true}},
          });
        } catch (err) {
          error = err;
        }

        // $FlowFixMe
        expect(error.message).toEqual('Configuration could not be loaded.');

        // $FlowFixMe
        const {errors} = error;
        expect(errors.length).toBe(1);
      });
    });
  });
});
