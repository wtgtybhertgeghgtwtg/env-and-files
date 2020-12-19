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

loadConfigSync({
  postgresPassword: {
    filePath: '/secrets/password',
  },
  postgresUrl: {
    format: (value) => new URL(value),
    variableName: 'POSTGRES_URL',
  },
  postgresUsername: {
    defaultValue: 'postgres',
    filePath: '/secrets/username',
  },
})
  .then((config) => {
    // "config" will be an object map of configuration properties.
    console.log(config);
  })
  .catch((error) => {
    // If any of the required properties cannot be loaded, the Promise will reject.
    console.error(error);
  });
```

## API

### loadConfig(configMap)

Load configuration. Returns a `Promise` that will resolve to the loaded configuration, or reject if the configuration was invalid.

#### configMap

Type: `Object`

An object map of configuration and where to find it. By default, all configuration properties are required. See [usage](#usage) for examples of config maps.

### loadConfigSync(configMap)

Load configuration, synchronously. Returns the loaded configuration, or throws if the configuration was invalid.

#### configMap

Type: `Object`

Same as the asynchronous version.

## License

MIT © Matthew Fernando Garcia
