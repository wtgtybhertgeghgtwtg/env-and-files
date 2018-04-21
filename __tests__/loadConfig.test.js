// @flow
import fs from 'fs';
import loadConfig, {type ConfigError} from '../src';

jest.mock('fs');

describe('loadConfig', () => {
  describe('invariants', () => {
    describe('with the callback interface', () => {
      function harness(configMap: any, message: string) {
        return done =>
          loadConfig(configMap, error => {
            // $FlowFixMe
            expect(error.message).toEqual(message);
            done();
          });
      }

      it(
        'gives an error if "configMap" is undefined.',
        harness(undefined, '"configMap" must be a ConfigMap object.'),
      );

      it(
        'gives an error if "configMap" is not an object.',
        harness('Not an object.', '"configMap" must be a ConfigMap object.'),
      );

      it(
        'gives an error if "configMap" is null.',
        harness(null, '"configMap" must be a ConfigMap object.'),
      );

      it(
        'gives an error if a property of "configMap" is not an object.',
        harness(
          {groupOne: 3},
          '"configMap.groupOne" must be a ConfigGroup object.',
        ),
      );

      it(
        'gives an error if a property of "configMap" is null.',
        harness(
          {groupOne: null},
          '"configMap.groupOne" must be a ConfigGroup object.',
        ),
      );

      it(
        'gives an error if a property of a property of "configMap" is not a string or an object.',
        harness(
          {groupOne: {propOne: 3}},
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        ),
      );

      it(
        'gives an error if a property of a property of "configMap" is null.',
        harness(
          {groupOne: {propOne: null}},
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        ),
      );

      it(
        'gives an error if a property of a property of "configMap" is an object with neither "filePath" nor "variableName".',
        harness(
          {groupOne: {propOne: {}}},
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        ),
      );

      it(
        'gives an error if a property of a property of "configMap" is an object with both "filePath" and "variableName" defined.',
        harness(
          {
            groupOne: {
              propOne: {filePath: '/prop.one', variableName: 'PROP_ONE'},
            },
          },
          'Cannot determine whether "configMap.groupOne.propOne" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.',
        ),
      );
    });

    describe('with the Promise interface', () => {
      function harness(configMap: any, message: string) {
        return () => expect(loadConfig(configMap)).rejects.toThrow(message);
      }

      it(
        'rejects if "configMap" is undefined.',
        harness(undefined, '"configMap" must be a ConfigMap object.'),
      );

      it(
        'rejects if "configMap" is not an object.',
        harness('Not an object.', '"configMap" must be a ConfigMap object.'),
      );

      it(
        'rejects if "configMap" is null.',
        harness(null, '"configMap" must be a ConfigMap object.'),
      );

      it('reject if "configMap" is undefined and "callback" is not a function or undefined.', async () => {
        const configPromise = loadConfig(
          // $FlowFixMe
          undefined,
          'Neither a function nor undefined.',
        );
        await expect(configPromise).rejects.toThrow(
          '"configMap" must be a ConfigMap object.',
        );
      });

      it('reject if "configMap" is not an object and "callback" is not a function or undefined.', async () => {
        const configPromise = loadConfig(
          // $FlowFixMe
          'Not an object.',
          'Neither a function nor undefined.',
        );
        await expect(configPromise).rejects.toThrow(
          '"configMap" must be a ConfigMap object.',
        );
      });

      it('reject if "configMap" is null and "callback" is not a function or undefined.', async () => {
        const configPromise = loadConfig(
          // $FlowFixMe
          null,
          'Neither a function nor undefined.',
        );
        await expect(configPromise).rejects.toThrow(
          '"configMap" must be a ConfigMap object.',
        );
      });

      it(
        'rejects if a property of "configMap" is not an object.',
        harness(
          {groupOne: 3},
          '"configMap.groupOne" must be a ConfigGroup object.',
        ),
      );

      it(
        'rejects if a property of "configMap" is null.',
        harness(
          {groupOne: null},
          '"configMap.groupOne" must be a ConfigGroup object.',
        ),
      );

      it(
        'rejects if a property of a property of "configMap" is not a string or an object.',
        harness(
          {groupOne: {propOne: 3}},
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        ),
      );

      it(
        'rejects if a property of a property of "configMap" is null.',
        harness(
          {groupOne: {propOne: null}},
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        ),
      );

      it(
        'rejects if a property of a property of "configMap" is an object with neither "filePath" nor "variableName".',
        harness(
          {groupOne: {propOne: {}}},
          '"configMap.groupOne.propOne" must be a string, EnvironmentConfig object, or FileConfig object.',
        ),
      );

      it(
        'rejects if a property of a property of "configMap" is an object with both "filePath" and "variableName" defined.',
        harness(
          {
            groupOne: {
              propOne: {filePath: '/prop.one', variableName: 'PROP_ONE'},
            },
          },
          'Cannot determine whether "configMap.groupOne.propOne" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.',
        ),
      );

      it('rejects if "callback" is not a a function or undefined.', async () => {
        const configPromise = loadConfig(
          {},
          // $FlowFixMe
          'Neither a function nor undefined.',
        );
        await expect(configPromise).rejects.toThrow(
          '"callback" must be a function or undefined.',
        );
      });
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

      describe('with the callback interface', () => {
        it('is undefined.', done => {
          loadConfig({groupOne: {propOne: {variableName}}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toBeUndefined();
            done();
          });
        });

        it('is undefined if using shorthand syntax.', () => {
          loadConfig({groupOne: {propOne: variableName}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toBeUndefined();
          });
        });

        it('gives an error if required.', done => {
          loadConfig(
            {groupOne: {propOne: {required: true, variableName}}},
            (error, config) => {
              expect(config.groupOne.propOne).toBeUndefined();
              // $FlowFixMe
              expect(error.message).toEqual(
                'Configuration could not be loaded.',
              );

              const {errors} = error || {};
              expect(errors.length).toBe(1);
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

      describe('with the callback interface', () => {
        it('is undefined.', done => {
          loadConfig({groupOne: {propOne: {filePath}}}, (error, config) => {
            expect(error).toBeNull();
            expect(config.groupOne.propOne).toBeUndefined();
            done();
          });
        });

        it('gives an error if required.', () => {
          loadConfig(
            {groupOne: {propOne: {filePath, required: true}}},
            (error, config) => {
              expect(config.groupOne.propOne).toBeUndefined();
              // $FlowFixMe
              expect(error.message).toEqual(
                'Configuration could not be loaded.',
              );
              // $FlowFixMe
              expect(error.errors.length).toBe(1);
            },
          );
        });
      });
    });
  });

  describe('the error returned', () => {
    it('is serializable.', done => {
      const variableName = 'PROP_ONE';
      delete process.env[variableName];
      loadConfig(
        {groupOne: {propOne: {required: true, variableName}}},
        error => {
          const json = JSON.stringify(error);
          expect(json).toMatch(`${variableName} is not defined.`);
          done();
        },
      );
    });
  });
});
