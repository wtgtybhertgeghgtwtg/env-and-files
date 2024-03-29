/**
 * An error thrown when configuration could not be loaded.
 */
export default class ConfigError<
  ErrorMap extends Record<string, Error>,
> extends Error {
  /**
   * A collection of the individual errors, keyed by property name.
   */
  public errors: ErrorMap;

  /**
   * Create a ConfigError.
   * @param errors - The errors that this ConfigError represent.
   */
  public constructor(errors: ErrorMap) {
    super(
      [
        'Configuration could not be loaded for the following properties:',
        ...Object.entries(errors).map(
          ([key, {message}]) => `${key}: ${message}`,
        ),
      ].join('\n\t'),
    );
    this.errors = errors;
  }

  /**
   * Convert this ConfigError to JSON.
   *
   * @remarks
   * This is here so the ConfigError can be stringified a little cleaner.  Throwing it'll still just show the base message.
   * @returns An object containing the message of this error and the messages of the errors it represents.
   */
  public toJSON(): {
    errors: {[key in keyof ErrorMap]: string};
    message: string;
  } {
    return {
      errors: Object.fromEntries(
        Object.entries(this.errors).map(([key, {message}]) => [key, message]),
      ) as {[key in keyof ErrorMap]: string},
      message: this.message,
    };
  }
}
