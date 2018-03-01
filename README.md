# env-and-files

> Load configuration from environmental variables and files.

According to The Twelve-Factor App, [configuration should come from environmental variables](https://12factor.net/config). But since environmental variables can leak easily, some people use [secrets](https://kubernetes.io/docs/concepts/configuration/secret/) for sensitive information. This module is made to support either with minimal set-up.

## Install

```
$ yarn add env-and-files
```

## Usage

```js
const loadConfig = require('env-and-files');

loadConfig({
  // A conceptual grouping of configuration properties.  In this case, configuration for the logger.
  logger: {
    // The "logger.level" property will be equal to the "LOG_LEVEL" environmental variable, or null if it is not present.
    level: 'LOG_LEVEL',
  },
  server: {
    port: {
      // Specify that this property is required.  If "PORT" is not found, an error will be given.
      required: true,
      variableName: 'PORT',
    },
  },
  sql: {
    password: {
      // The "sql.password" property will be equal to the contents of "/path/to/secret", or null if it could not be read.
      filePath: '/path/to/secret',
      required: true,
    },
  },
}).then(
  config => {
    // "config" will be an object map of configuration groups.  In this case, the shape would be:
    // { logger: { level: ?string }, server: { port: ?string }, sql: { password: ?string } }
    console.log(config);
  },
  error => {
    // If any of the required properties cannot be loaded, the Promise will reject.
    console.log(error);
  },
);

// Alternatively, using a callback.
loadConfig(
  {
    logger: {
      level: 'LOG_LEVEL',
    },
    server: {
      port: {
        required: true,
        variableName: 'PORT',
      },
    },
    sql: {
      password: {
        filePath: '/path/to/secret',
        required: true,
      },
    },
  },
  (error, config) => {
    // "config" will be provided whether or not there is an error.
    console.log(config);
  },
);
```

## API

### loadConfig(configMap, callback?)

If `callback` is not defined, returns a `Promise` that is fulfilled once all configuration properties in `configMap` are loaded. The fulfilled value is an object map containing the loaded configuration properties. If a required property could not be loaded, the Promise will reject. If `callback` is defined, it will be called with an error (if any) and the loaded configuration properties.

## License

MIT © Matthew Fernando Garcia
