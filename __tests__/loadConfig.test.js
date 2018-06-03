// @flow
import fs from 'fs';
import {loadConfig, type ConfigError} from '../src';

jest.mock('fs');

describe('loadConfig', () => {
  it('can load empty groups', async () => {
    const config = await loadConfig({groupOne: {}});

    expect(config.groupOne).toEqual({});
  });

  describe('invariants', () => {
    it.each([undefined, 'not an object', null])(
      'rejects if "configMap" is %s.',
      async configMap => {
        await expect(loadConfig(configMap)).rejects.toThrow(
          '"configMap" must be a ConfigMap object.',
        );
      },
    );

    it.each`
      condition          | groupOne
      ${'not an object'} | ${3}
      ${'null'}          | ${null}
    `(
      'rejects if a property of "configMap" is $condition.',
      async ({groupOne}) => {
        await expect(loadConfig({groupOne})).rejects.toThrow(
          '"configMap.groupOne" must be a ConfigGroup object.',
        );
      },
    );

    it.each`
      condition                                                 | propOne
      ${'neither a string nor an object'}                       | ${3}
      ${'null'}                                                 | ${null}
      ${'an object with neither "filePath" nor "variableName"'} | ${{}}
    `(
      'rejects if a property of a property of "configMap" is $condition.',
      async ({propOne}) => {
        await expect(loadConfig({groupOne: {propOne}})).rejects.toThrow(
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        );
      },
    );

    it.each`
      condition                          | type
      ${'not a string or undefined'}     | ${3}
      ${'neither "number" nor "string"'} | ${"Neither 'number' nor 'string'."}
    `(
      'rejects if the "type" of a property of a property of "configMap" is $condition.',
      async ({type}) => {
        await expect(
          loadConfig({
            groupOne: {propOne: {type, variableName: 'PROP_ONE'}},
          }),
        ).rejects.toThrow(
          `"configMap.groupOne.propOne.type" must be 'number', 'string', or undefined.`,
        );
      },
    );

    it('rejects if a property of a property of "configMap" is an object with both "filePath" and "variableName" defined.', async () => {
      await expect(
        loadConfig({
          groupOne: {
            propOne: {filePath: '/prop.one', variableName: 'PROP_ONE'},
          },
        }),
      ).rejects.toThrow(
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

      it('equals the environmental variable.', async () => {
        const config = await loadConfig({
          groupOne: {propOne: {variableName}},
        });

        expect(config.groupOne.propOne).toEqual(variableValue);
      });

      it('equals the environmental variable (using shorthand syntax).', async () => {
        const config = await loadConfig({
          groupOne: {propOne: variableName},
        });

        expect(config.groupOne.propOne).toEqual(variableValue);
      });
    });

    describe('when the environmental variable is not present', () => {
      beforeEach(() => {
        delete process.env[variableName];
      });

      it('is undefined.', async () => {
        const config = await loadConfig({
          groupOne: {propOne: {variableName}},
        });

        expect(config.groupOne.propOne).toBeUndefined();
      });

      it('is undefined if using shorthand syntax.', async () => {
        const config = await loadConfig({
          groupOne: {propOne: variableName},
        });

        expect(config.groupOne.propOne).toBeUndefined();
      });

      it('rejects if required.', async () => {
        const configPromise = loadConfig({
          groupOne: {propOne: {required: true, variableName}},
        });
        await expect(configPromise).rejects.toThrow(
          'Configuration could not be loaded.',
        );

        // $FlowFixMe
        const error: ConfigError = await configPromise.catch(err => err);

        expect(error.message).toEqual('Configuration could not be loaded.');

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

      it('equals the file content decoded as UTF-8 if no encoding is defined.', async () => {
        // $FlowFixMe
        fs.__setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const config = await loadConfig({
          groupOne: {propOne: {filePath}},
        });

        expect(config.groupOne.propOne).toEqual(fileContent);
        expect(fs.readFile).toHaveBeenCalledWith(
          filePath,
          'utf8',
          expect.anything(),
        );
      });

      it('equals the file content decoded using the given encoding, if defined.', async () => {
        // $FlowFixMe
        fs.__setFiles({[filePath]: Buffer.from(fileContent, 'ascii')});

        const config = await loadConfig({
          groupOne: {propOne: {encoding: 'ascii', filePath}},
        });

        expect(config.groupOne.propOne).toEqual(fileContent);
        expect(fs.readFile).toHaveBeenCalledWith(
          filePath,
          'ascii',
          expect.anything(),
        );
      });
    });

    describe('when the file is not present', () => {
      beforeEach(() => {
        // $FlowFixMe
        fs.__setFiles({});
      });

      it('is undefined.', async () => {
        const config = await loadConfig({
          groupOne: {propOne: {filePath}},
        });

        expect(config.groupOne.propOne).toBeUndefined();
      });

      it('rejects if required.', async () => {
        const configPromise = loadConfig({
          groupOne: {propOne: {filePath, required: true}},
        });
        await expect(configPromise).rejects.toThrow(
          'Configuration could not be loaded.',
        );
        // $FlowFixMe
        const error: ConfigError = await configPromise.catch(err => err);

        expect(error.message).toEqual('Configuration could not be loaded.');

        const {errors} = error;
        expect(errors.length).toBe(1);
      });
    });
  });

  describe('type conversion.', () => {
    const variableName = 'PROP_ONE';

    it(`converts to a number if "type" is 'number' and the property can be parsed as a number.`, async () => {
      process.env[variableName] = '1220';

      const config = await loadConfig({
        groupOne: {propOne: {type: 'number', variableName}},
      });

      expect(config.groupOne.propOne).toEqual(1220);
    });

    it(`throws if "type" is 'number' and the property cannot be parsed as a number.`, async () => {
      process.env[variableName] = 'Not a number.';

      const configPromise = loadConfig({
        groupOne: {propOne: {type: 'number', variableName}},
      });
      await expect(configPromise).rejects.toThrow(
        'Configuration could not be loaded.',
      );

      // $FlowFixMe
      const error: ConfigError = await configPromise.catch(err => err);

      // $FlowFixMe
      expect(error.message).toEqual('Configuration could not be loaded.');

      // $FlowFixMe
      const {errors} = error;
      expect(errors.length).toBe(1);
      expect(errors[0].message).toEqual(
        'The value for "configMap.groupOne.propOne" was defined, but could not be coerced to a number.',
      );
    });
  });

  describe('the error returned', () => {
    it('is serializable.', done => {
      const variableName = 'PROP_ONE';
      delete process.env[variableName];
      loadConfig({groupOne: {propOne: {required: true, variableName}}}).catch(
        error => {
          const json = JSON.stringify(error);
          expect(json).toMatch(`${variableName} is not defined.`);
          done();
        },
      );
    });
  });
});
