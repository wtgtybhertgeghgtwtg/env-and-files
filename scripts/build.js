const builtinModules = require('builtin-modules');
const {rollup} = require('rollup');
const babel = require('rollup-plugin-babel');
const write = require('write');
const pkg = require('../package.json');

rollup({
  external: [...builtinModules, ...Object.keys(pkg.dependencies)],
  input: 'src/index.js',
  plugins: [babel()],
}).then(async bundle => {
  await bundle.write({file: pkg.main, format: 'cjs', sourcemap: true});
  await write(`${pkg.main}.flow`, "// @flow\nexport * from '../src';");
  await bundle.write({file: pkg.module, format: 'es', sourcemap: true});
});
