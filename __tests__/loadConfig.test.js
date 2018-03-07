// @flow
import fs from 'fs';
import ConfigError from '../src/ConfigError';
import loadConfig from '../src/loadConfig';

jest.mock('fs');

describe('loadConfig', () => {
  describe('invariants', () => {
    it('throws if "configMap" is undefined.', () => {
      // $FlowFixMe
      expect(() => loadConfig()).toThrow(
        '"configMap" must be a ConfigMap object.',
      );
    });

    it('throws if "configMap" is not an object.', () => {
      // $FlowFixMe
      expect(() => loadConfig('Not an object.')).toThrow(
        '"configMap" must be a ConfigMap object.',
      );
    });

    it('throws if "configMap" is null.', () => {
      // $FlowFixMe
      expect(() => loadConfig(null)).toThrow(
        '"configMap" must be a ConfigMap object.',
      );
    });

    it('throws if a property of "configMap" is not an object.', () => {
      // $FlowFixMe
      expect(() => loadConfig({groupOne: 3})).toThrow(
        '"configMap.groupOne" must be a ConfigGroup object.',
      );
    });

    it('throws if a property of "configMap" is null.', () => {
      // $FlowFixMe
      expect(() => loadConfig({groupOne: null})).toThrow(
        '"configMap.groupOne" must be a ConfigGroup object.',
      );
    });

    it('throws if a property of a property of "configMap" is not a string or an object.', () => {
      // $FlowFixMe
      expect(() => loadConfig({groupOne: {propOne: 3}})).toThrow(
        '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
      );
    });

    it('throws if a property of a property of "configMap" is null.', () => {
      // $FlowFixMe
      expect(() => loadConfig({groupOne: {propOne: null}})).toThrow(
        '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
      );
    });

    it('throws if a property of a property of "configMap" is an object with neither "filePath" nor "variableName".', () => {
      // $FlowFixMe
      expect(() => loadConfig({groupOne: {propOne: {}}})).toThrow(
        '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
      );
    });

    it('throws if a property of a property of "configMap" is an object with both "filePath" and "variableName" defined.', () => {
      expect(() =>
        // $FlowFixMe
        loadConfig({
          groupOne: {
            propOne: {filePath: '/prop.one', variableName: 'PROP_ONE'},
          },
        }),
      ).toThrow(
        'Cannot determine whether "configMap.groupOne.propOne" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.',
      );
    });

    it('throws if "callback" is not a a function or undefined.', () => {
      // $FlowFixMe
      expect(() => loadConfig({}, 'Neither a function nor undefined.')).toThrow(
        '"callback" must be a function or undefined.',
      );
    });
  });

  describe('loading empty groups', () => {
    it('works with the Promise interface.', async () => {
      const config = await loadConfig({groupOne: {}});

      expect(config.groupOne).toEqual({});
    });

    it('works with the callback interface.', done => {
      loadConfig({groupOne: {}}, (error, config) => {
        expect(error).toBeNull();
        expect(config.groupOne).toEqual({});
        done();
      });
    });
  });

  describe('loading environmental variables', () => {
    const variableName = 'PROP_ONE';

    describe('when the environmental variable is present', () => {
      const variableValue = 'The first property.';

      beforeEach(() => {
        process.env[variableName] = variableValue;
      });

      describe('with the Promise interface', () => {
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

      describe('with the callback interface', () => {
        it('equals the environmental variable.', done => {
          loadConfig({groupOne: {propOne: {variableName}}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toEqual(variableValue);
            done();
          });
        });

        it('equals the environmental variable (using shorthand syntax).', done => {
          loadConfig({groupOne: {propOne: variableName}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toEqual(variableValue);
            done();
          });
        });
      });
    });

    describe('when the environmental variable is not present', () => {
      beforeEach(() => {
        delete process.env[variableName];
      });

      describe('with the Promise interface', () => {
        it('equals null.', async () => {
          const config = await loadConfig({
            groupOne: {propOne: {variableName}},
          });

          expect(config.groupOne.propOne).toBeNull();
        });

        it('equals null if using shorthand syntax.', async () => {
          const config = await loadConfig({
            groupOne: {propOne: variableName},
          });

          expect(config.groupOne.propOne).toBeNull();
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

          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('Configuration could not be loaded.');

          const {errors} = error;
          expect(errors.length).toBe(1);
          expect(errors[0]).toBeInstanceOf(Error);
          expect(errors[0].message).toEqual('PROP_ONE is not defined.');
        });
      });

      describe('with the callback interface', () => {
        it('equals null.', done => {
          loadConfig({groupOne: {propOne: {variableName}}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toBeNull();
            done();
          });
        });

        it('equals null if using shorthand syntax.', () => {
          loadConfig({groupOne: {propOne: variableName}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toBeNull();
          });
        });

        it('gives an error if required.', done => {
          loadConfig(
            {groupOne: {propOne: {required: true, variableName}}},
            (error, config) => {
              expect(error).toBeInstanceOf(Error);
              expect(config.groupOne.propOne).toBeNull();
              // $FlowFixMe
              expect(error.message).toEqual(
                'Configuration could not be loaded.',
              );

              const {errors} = error || {};
              expect(errors.length).toBe(1);
              expect(errors[0]).toBeInstanceOf(Error);
              expect(errors[0].message).toEqual('PROP_ONE is not defined.');
              done();
            },
          );
        });
      });
    });
  });

  describe('loading files', () => {
    const filePath = '/prop.one';

    describe('when the file is present', () => {
      const fileContent = 'The first property.';

      describe('with the Promise interface', () => {
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

      describe('with the callback interface', () => {
        it('equals the file content decoded as UTF-8 if no encoding is defined.', done => {
          // $FlowFixMe
          fs.__setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

          loadConfig({groupOne: {propOne: {filePath}}}, (error, config) => {
            expect(config.groupOne.propOne).toEqual(fileContent);
            expect(fs.readFile).toHaveBeenCalledWith(
              filePath,
              'utf8',
              expect.anything(),
            );
            done();
          });
        });

        it('equals the file content decoded using the given encoding, if defined.', done => {
          // $FlowFixMe
          fs.__setFiles({[filePath]: Buffer.from(fileContent, 'ascii')});

          loadConfig(
            {groupOne: {propOne: {encoding: 'ascii', filePath}}},
            (error, config) => {
              expect(config.groupOne.propOne).toEqual(fileContent);
              expect(fs.readFile).toHaveBeenCalledWith(
                filePath,
                'ascii',
                expect.anything(),
              );
              done();
            },
          );
        });
      });
    });

    describe('when the file is not present', () => {
      beforeEach(() => {
        // $FlowFixMe
        fs.__setFiles({});
      });

      describe('with the Promise interface', () => {
        it('equals null.', async () => {
          const config = await loadConfig({
            groupOne: {propOne: {filePath}},
          });

          expect(config.groupOne.propOne).toBeNull();
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

          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('Configuration could not be loaded.');

          const {errors} = error;
          expect(errors.length).toBe(1);
          expect(errors[0]).toBeInstanceOf(Error);
        });
      });

      describe('with the callback interface', () => {
        it('equals null.', done => {
          loadConfig({groupOne: {propOne: {filePath}}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toBeNull();
            done();
          });
        });

        it('gives an error if required.', () => {
          loadConfig(
            {groupOne: {propOne: {filePath, required: true}}},
            (error, config) => {
              expect(error).toBeInstanceOf(Error);
              expect(config.groupOne.propOne).toBeNull();
              // $FlowFixMe
              expect(error.message).toEqual(
                'Configuration could not be loaded.',
              );

              const {errors} = error || {};
              expect(errors.length).toBe(1);
              expect(errors[0]).toBeInstanceOf(Error);
            },
          );
        });
      });
    });
  });
});
