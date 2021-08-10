jest.mock('fs');

import fs from 'fs';
import {ConfigError, loadConfig} from '../source';

describe('loadConfig', () => {
  it('can load empty configurations.', async () => {
    const config = await loadConfig({});

    expect(config).toEqual({});
  });

  describe('invariants', () => {
    it('rejects if a property config of "configMap" has neither "filePath" nor "variableName".', async () => {
      // @ts-expect-error-ignore
      await expect(loadConfig({property: {}})).rejects.toThrow(
        '"configMap.property" must be a string, EnvironmentConfig object, or FileConfig object.  Neither "filePath" nor "variableName" are defined.',
      );
    });

    it('rejects if a property config of "configMap" has both "filePath" and "variableName".', async () => {
      await expect(
        loadConfig({
          property: {
            filePath: './path/file.extension',
            variableName: 'VARIABLE_NAME',
          },
        }),
      ).rejects.toThrow(
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

      it('equals the environment variable.', async () => {
        const config = await loadConfig({
          variableProperty: {
            variableName,
          },
        });
        expect(config.variableProperty).toEqual(variableValue);
      });

      it('equals the environment variable (using shorthand syntax).', async () => {
        const config = await loadConfig({variableProperty: variableName});
        expect(config.variableProperty).toEqual(variableValue);
      });

      it('does not use the default value.', async () => {
        const defaultValue = 'SOMETHING_ELSE';
        const config = await loadConfig({
          variableProperty: {
            defaultValue,
            variableName,
          },
        });
        expect(config.variableProperty).not.toEqual(defaultValue);
        expect(config.variableProperty).toEqual(variableValue);
      });

      it('is passed to the formatter.', async () => {
        const formatter = jest.fn();
        await loadConfig({
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
        it('rejects by default.', async () => {
          try {
            await loadConfig({
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

        it('rejects by default (using shorthand syntax).', async () => {
          try {
            await loadConfig({
              variableProperty: variableName,
            });
          } catch (error) {
            const {errors} = error as ConfigError<{variableProperty: Error}>;
            expect(errors.variableProperty.message).toEqual(
              'VARIABLE_NAME is not defined.',
            );
          }
        });

        it('rejects if explicitly required.', async () => {
          try {
            await loadConfig({
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

        it('is undefined if not required.', async () => {
          const config = await loadConfig({
            variableProperty: {
              required: false,
              variableName,
            },
          });
          expect(config.variableProperty).toBeUndefined();
        });

        it('is not passed to the formatter.', async () => {
          const formatter = jest.fn();
          await loadConfig({
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

        it('equals the default value.', async () => {
          const config = await loadConfig({
            variableProperty: {
              defaultValue,
              variableName,
            },
          });
          expect(config.variableProperty).toEqual(defaultValue);
        });

        it('equals the default value if explicitly required.', async () => {
          const config = await loadConfig({
            variableProperty: {
              defaultValue,
              required: true,
              variableName,
            },
          });
          expect(config.variableProperty).toEqual(defaultValue);
        });

        it('equals the default value if not required.', async () => {
          const config = await loadConfig({
            variableProperty: {
              defaultValue,
              required: false,
              variableName,
            },
          });
          expect(config.variableProperty).toEqual(defaultValue);
        });

        it('is not passed the formatter.', async () => {
          const formatter = jest.fn();
          await loadConfig({
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

      it('equals the file content decoded as UTF-8 if no encoding is defined.', async () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const config = await loadConfig({
          fileProperty: {
            filePath,
          },
        });
        expect(config.fileProperty).toEqual(fileContent);
      });

      it('equals the file content decoded using the given encoding, if defined.', async () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'ascii')});

        const config = await loadConfig({
          fileProperty: {
            encoding: 'ascii',
            filePath,
          },
        });
        expect(config.fileProperty).toEqual(fileContent);
      });

      it('does not use the default value.', async () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const defaultValue = 'SOMETHING_ELSE';
        const config = await loadConfig({
          variableProperty: {
            defaultValue,
            filePath,
          },
        });
        expect(config.variableProperty).not.toEqual(defaultValue);
        expect(config.variableProperty).toEqual(fileContent);
      });

      it('is passed to the formatter.', async () => {
        // @ts-expect-error-ignore
        fs._setFiles({[filePath]: Buffer.from(fileContent, 'utf8')});

        const formatter = jest.fn();
        await loadConfig({
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
        it('rejects by default.', async () => {
          try {
            await loadConfig({
              fileProperty: {
                filePath,
              },
            });
          } catch (error) {
            const {errors} = error as ConfigError<{fileProperty: Error}>;
            expect(errors.fileProperty.message).toEqual('File not found.');
          }
        });

        it('rejects if explicitly required.', async () => {
          try {
            await loadConfig({
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

        it('is undefined if not required.', async () => {
          const config = await loadConfig({
            fileProperty: {
              filePath,
              required: false,
            },
          });
          expect(config.fileProperty).toBeUndefined();
        });

        it('is not passed to the formatter.', async () => {
          const formatter = jest.fn();
          await loadConfig({
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

        it('equals the default value.', async () => {
          const config = await loadConfig({
            fileProperty: {
              defaultValue,
              filePath,
            },
          });
          expect(config.fileProperty).toEqual(defaultValue);
        });

        it('equals the default value if explicitly required.', async () => {
          const config = await loadConfig({
            fileProperty: {
              defaultValue,
              filePath,
              required: true,
            },
          });
          expect(config.fileProperty).toEqual(defaultValue);
        });

        it('equals the default value if not required.', async () => {
          const config = await loadConfig({
            fileProperty: {
              defaultValue,
              filePath,
              required: false,
            },
          });
          expect(config.fileProperty).toEqual(defaultValue);
        });

        it('is not passed the formatter.', async () => {
          const formatter = jest.fn();
          await loadConfig({
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

    it('returns the formatted value.', async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): string => value.toLowerCase();

      const config = await loadConfig({
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

    it('returns the formatted value if explicitly required.', async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): number => value.length;

      const config = await loadConfig({
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

    it('returns the formatted value if not required.', async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): number => value.length;

      const config = await loadConfig({
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

    it('rejects if the formatter throws.', async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const formatter = (value: string): number => {
        const integer = Number.parseInt(value, 10);
        if (Number.isNaN(integer)) {
          throw new TypeError('Not a number.');
        }
        return integer;
      };

      try {
        await loadConfig({
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
});

describe('loading errors', () => {
  const filePath = '/path/file.extension';
  const variableName = 'VARIABLE_NAME';

  it('stringifies to include all messages.', async () => {
    delete process.env[variableName];
    // @ts-expect-error-ignore
    fs._setFiles({});

    try {
      await loadConfig({
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

  it('includes unloaded properties in the message.', async () => {
    try {
      await loadConfig({
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
