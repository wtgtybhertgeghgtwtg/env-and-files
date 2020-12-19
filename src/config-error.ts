/**
 * An error thrown when configuration could not be loaded.
 */
export default class ConfigError<
  ErrorMap extends Record<string, Error>
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
    super('Configuration could not be loaded.');
    this.errors = errors;
  }

  /**
   * Convert this ConfigError to JSON.
   *
   * @remarks
   * This is here so the ConfigError can be stringified a little cleaner.  Throwing it'll still just show the base message.
   * @returns An object containing the message of this error and the messages of the errors it represents.
   */
  public toJSON(): {errors: {[name: string]: string}; message: string} {
    return {
      errors: Object.fromEntries(
        Object.entries(this.errors).map(([key, {message}]) => [key, message]),
      ),
      message: this.message,
    };
  }
}
