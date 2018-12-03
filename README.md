# env-and-files

> Load configuration from environmental variables and files.

According to The Twelve-Factor App, [configuration should come from environmental variables](https://12factor.net/config). But since environmental variables can leak easily, some people use [secrets](https://kubernetes.io/docs/concepts/configuration/secret/) for sensitive information. This module is made to support either with minimal set-up.

## Install

```
npm install env-and-files
```

Or, with `yarn`:

```
$ yarn add env-and-files
```

## Usage

```js
const {loadConfig} = require('env-and-files');

loadConfig({
  // A conceptual grouping of configuration properties.  In this case, configuration for the logger.
  logger: {
    // The "logger.level" property will be equal to the "LOG_LEVEL" environmental variable, or undefined if it is not present.
    level: 'LOG_LEVEL',
  },
  server: {
    port: {
      // Specify that this property is required.  If "PORT" is not found, an error will be given.
      required: true,
      // Coerce the value to a number.  If it can't be coerced, an error will be given.
      type: 'number',
      variableName: 'PORT',
    },
  },
  sql: {
    password: {
      // The "sql.password" property will be equal to the contents of "/path/to/secret", or undefined if it could not be read.
      filePath: '/path/to/secret',
      required: true,
    },
  },
})
  .then(config => {
    // "config" will be an object map of configuration groups.  So, you'd get something like
    // { logger: { level: undefined }, server: { port: 8000 }, sql: { password: 'abc123' } }
    console.log(config);
  })
  .catch(error => {
    // If any of the required properties cannot be loaded, the Promise will reject.
    console.error(error);
  });
```

## API

### loadConfig(configMap)

Load configuration. Returns a `Promise` that will resolve to the loaded configuration, or reject if the configuration was invalid.

#### configMap

Type: `Object`

An object map of conceptual groupings of necessary configuration and where to find it. By default, all configuration properties are optional, but if one is marked required and is not found, an error will be given. See [usage](#usage) for examples of config maps.

### loadConfigSync(configMap)

Load configuration, synchronously. Returns the loaded configuration, or throws if the configuration was invalid.

#### configMap

Type: `Object`

Same as the asynchronous version.

## License

MIT © Matthew Fernando Garcia
