jest.mock('fs');

import fs from 'fs';
import {ConfigError, loadConfigSync} from '../source';

describe('loadConfig', () => {
  it('can load empty configurations.', () => {
    const config = loadConfigSync({});

    expect(config).toEqual({});
  });

  describe('invariants', () => {
    it('throws if a property config of "configMap" has neither "filePath" nor "variableName".', () => {
      // @ts-expect-error
      expect(() => loadConfigSync({property: {}})).toThrow(
        '"configMap.property" must be a string, EnvironmentConfig object, or FileConfig object.  Neither "filePath" nor "variableName" are defined.',
      );
    });

    it('throws if a property config of "configMap" has both "filePath" and "variableName".', () => {
      expect(() =>
        loadConfigSync({
          property: {
            filePath: './path/file.extension',
            variableName: 'VARIABLE_NAME',
          },
        }),
      ).toThrow(
        'Cannot determine whether "configMap.property" is an EnvironmentConfig object or a FileConfig object.  Both "filePath" and "variableName" are defined.',
      );
    });
  });

  describe('loading environment variables', () => {
    const variableName = 'VARIABLE_NAME';

    describe('when the environment variable is present', () => {
      const variableValue = 'The value of this environment variable.';

      beforeEach(() => {
        process.env[variableName] = variableValue;
      });

      it('equals the environment variable.', () => {
        const config = loadConfigSync({
          variableProperty: {
            variableName,
          },
        });
        expect(config.variableProperty).toEqual(variableValue);
      });

      it('equals the environment variable (using shorthand syntax).', () => {
        const config = loadConfigSync({variableProperty: variableName});
        expect(config.variableProperty).toEqual(variableValue);
      });

      it('does not use the default value.', () => {
        const defaultValue = 'SOMETHING_ELSE';
        const config = loadConfigSync({
          variableProperty: {
            defaultValue,
            variableName,
          },
        });
        expect(config.variableProperty).not.toEqual(defaultValue);
        expect(config.variableProperty).toEqual(variableValue);
      });

      it('is passed to the formatter.', () => {
        const formatter = jest.fn();
        loadConfigSync({
          variableProperty: {
            format: formatter,
            variableName,
          },
        });
        expect(formatter).toHaveBeenCalledWith(variableValue);
      });
    });

    describe('when the environment variable is not present', () => {
      beforeEach(() => {
        delete process.env[variableName];
      });

      describe('without a default value', () => {
        it('throws by default.', () => {
          try {
            loadConfigSync({
              variableProperty: {
                variableName,
              },
            });
          } catch (error) {
            const {errors} = error as ConfigError<{variableProperty: Error}>;
            expect(errors.variableProperty.message).toEqual(
              'VARIABLE_NAME is not defined.',
            );
          }
        });

        it('throws by default (using shorthand syntax).', () => {
          try {
            loadConfigSync({
              variableProperty: variableName,
            });
          } catch (error) {
            const {errors} = error as ConfigError<{variableProperty: Error}>;
            expect(errors.variableProperty.message).toEqual(
              'VARIABLE_NAME is not defined.',
            );
          }
        });

        it('throws if explicitly required.', () => {
          try {
            loadConfigSync({
              variableProperty: {
                required: true,
                variableName,
              },
            });
          } catch (error) {
            const {errors} = error as ConfigError<{variableProperty: Error}>;
            expect(errors.variableProperty.message).toEqual(
              'VARIABLE_NAME is not defined.',
            );
          }
        });

        it('is undefined if not required.', () => {
          const config = loadConfigSync({
            variableProperty: {
              required: false,
              variableName,
            },
          });
          expect(config.variableProperty).toBeUndefined();
        });

        it('is not passed to the formatter.', () => {
          const formatter = jest.fn();
          loadConfigSync({
            variableProperty: {
              format: formatter,
              required: false,
              variableName,
            },
          });
          expect(formatter).not.toHaveBeenCalled();
        });
      });

      describe('with a default value', () => {
        const defaultValue = 'SOMETHING_ELSE';

        it('equals the default value.', () => {
          const config = loadConfigSync({
            variableProperty: {
              defaultValue,
              variableName,
            },
          });
          expect(config.variableProperty).toEqual(defaultValue);
        });

        it('equals the default value if explicitly required.', () => {
          const config = loadConfigSync({
            variableProperty: {
              defaultValue,
              required: true,
              variableName,
            },
          });
          expect(config.variableProperty).toEqual(defaultValue);
        });

        it('equals the default value if not required.', () => {
          const config = loadConfigSync({
            variableProperty: {
              defaultValue,
              required: false,
              variableName,
            },
          });
          expect(config.variableProperty).toEqual(defaultValue);
        });

        it('is not passed the formatter.', () => {
          const formatter = jest.fn();
          loadConfigSync({
            variableProperty: {
              defaultValue,
              format: formatter,
              variableName,
            },
          });
          expect(formatter).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('loading files', () => {
    const filePath = '/path/file.extension';

    describe('when the file is present', () => {
      const fileContent = 'The content of this file.';

      it('equals the file content decoded as UTF-8 if no encoding is defined.', () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const config = loadConfigSync({
          fileProperty: {
            filePath,
          },
        });
        expect(config.fileProperty).toEqual(fileContent);
      });

      it('equals the file content decoded using the given encoding, if defined.', () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'ascii')});

        const config = loadConfigSync({
          fileProperty: {
            encoding: 'ascii',
            filePath,
          },
        });
        expect(config.fileProperty).toEqual(fileContent);
      });

      it('does not use the default value.', () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const defaultValue = 'SOMETHING_ELSE';
        const config = loadConfigSync({
          variableProperty: {
            defaultValue,
            filePath,
          },
        });
        expect(config.variableProperty).not.toEqual(defaultValue);
        expect(config.variableProperty).toEqual(fileContent);
      });

      it('is passed to the formatter.', () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const formatter = jest.fn();
        loadConfigSync({
          fileProperty: {
            filePath,
            format: formatter,
          },
        });
        expect(formatter).toHaveBeenCalledWith(fileContent);
      });
    });

    describe('when the file is not present', () => {
      beforeEach(() => {
        // @ts-expect-error-ignore
        fs._setFiles({});
      });

      describe('without a default value', () => {
        it('throws by default.', () => {
          try {
            loadConfigSync({
              fileProperty: {
                filePath,
              },
            });
          } catch (error) {
            const {errors} = error as ConfigError<{fileProperty: Error}>;
            expect(errors.fileProperty.message).toEqual('File not found.');
          }
        });

        it('throws if explicitly required.', () => {
          try {
            loadConfigSync({
              fileProperty: {
                filePath,
                required: true,
              },
            });
          } catch (error) {
            const {errors} = error as ConfigError<{fileProperty: Error}>;
            expect(errors.fileProperty.message).toEqual('File not found.');
          }
        });

        it('is undefined if not required.', () => {
          const config = loadConfigSync({
            fileProperty: {
              filePath,
              required: false,
            },
          });
          expect(config.fileProperty).toBeUndefined();
        });

        it('is not passed to the formatter.', () => {
          const formatter = jest.fn();
          loadConfigSync({
            fileProperty: {
              filePath,
              required: false,
            },
          });
          expect(formatter).not.toHaveBeenCalled();
        });
      });

      describe('with a default value', () => {
        const defaultValue = 'SOMETHING_ELSE';

        it('equals the default value.', () => {
          const config = loadConfigSync({
            fileProperty: {
              defaultValue,
              filePath,
            },
          });
          expect(config.fileProperty).toEqual(defaultValue);
        });

        it('equals the default value if explicitly required.', () => {
          const config = loadConfigSync({
            fileProperty: {
              defaultValue,
              filePath,
              required: true,
            },
          });
          expect(config.fileProperty).toEqual(defaultValue);
        });

        it('equals the default value if not required.', () => {
          const config = loadConfigSync({
            fileProperty: {
              defaultValue,
              filePath,
              required: false,
            },
          });
          expect(config.fileProperty).toEqual(defaultValue);
        });

        it('is not passed the formatter.', () => {
          const formatter = jest.fn();
          loadConfigSync({
            variableProperty: {
              defaultValue,
              format: formatter,
              filePath,
            },
          });
          expect(formatter).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('formatting properties', () => {
    const fileContent = 'The content of this file.';
    const filePath = '/path/file.extension';
    const variableName = 'VARIABLE_NAME';
    const variableValue = 'The value of this environment variable.';

    beforeEach(() => {
      process.env[variableName] = variableValue;
      // @ts-expect-error-ignore
      fs._setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});
    });

    it('returns the formatted value.', () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): number => value.length;

      const config = loadConfigSync({
        fileProperty: {
          filePath,
          format: formatter,
        },
        variableProperty: {
          format: formatter,
          variableName,
        },
      });

      expect(config.fileProperty).toEqual(formatter(fileContent));
      expect(config.variableProperty).toEqual(formatter(variableValue));
    });

    it('returns the formatted value if explicitly required.', () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): number => value.length;

      const config = loadConfigSync({
        fileProperty: {
          filePath,
          format: formatter,
          required: true,
        },
        variableProperty: {
          format: formatter,
          required: true,
          variableName,
        },
      });

      expect(config.fileProperty).toEqual(formatter(fileContent));
      expect(config.variableProperty).toEqual(formatter(variableValue));
    });

    it('returns the formatted value if not required.', () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): number => value.length;

      const config = loadConfigSync({
        fileProperty: {
          filePath,
          format: formatter,
          required: false,
        },
        variableProperty: {
          format: formatter,
          required: false,
          variableName,
        },
      });

      expect(config.fileProperty).toEqual(formatter(fileContent));
      expect(config.variableProperty).toEqual(formatter(variableValue));
    });

    it('throws if the formatter throws.', () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): number => {
        const integer = Number.parseInt(value, 10);
        if (Number.isNaN(integer)) {
          throw new TypeError('Not a number.');
        }
        return integer;
      };

      try {
        loadConfigSync({
          fileProperty: {
            filePath,
            format: formatter,
          },
          variableProperty: {
            format: formatter,
            variableName,
          },
        });
      } catch (error) {
        const {errors} = error as ConfigError<{
          fileProperty: Error;
          variableProperty: Error;
        }>;
        expect(errors.fileProperty.message).toEqual('Not a number.');
        expect(errors.variableProperty.message).toEqual('Not a number.');
      }
    });
  });

  describe('loading errors', () => {
    const filePath = '/path/file.extension';
    const variableName = 'VARIABLE_NAME';

    beforeEach(() => {
      delete process.env[variableName];
      // @ts-expect-error-ignore
      fs._setFiles({});
    });

    it('stringifies to include all messages.', () => {
      try {
        loadConfigSync({
          fileProperty: {
            filePath,
          },
          variableProperty: {
            variableName,
          },
        });
      } catch (error) {
        const errorMessage = JSON.stringify(error);
        expect(errorMessage).toMatch('File not found.');
        expect(errorMessage).toMatch('VARIABLE_NAME is not defined.');
      }
    });

    it('includes unloaded properties in the message.', () => {
      try {
        loadConfigSync({
          fileProperty: {
            filePath,
          },
          variableProperty: {
            variableName,
          },
        });
      } catch (error) {
        expect(error.message).toMatch('fileProperty: File not found.');
        expect(error.message).toMatch(
          'variableProperty: VARIABLE_NAME is not defined.',
        );
      }
    });
  });
});
