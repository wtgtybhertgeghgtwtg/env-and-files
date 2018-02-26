// @flow
import builtinModules from 'builtin-modules';
import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow';
import pkg from './package.json';

export default {
  external: [...builtinModules, ...Object.keys(pkg.dependencies)],
  input: 'src/loadConfig.js',
  output: {file: pkg.main, format: 'cjs', sourcemap: true},
  plugins: [
    flow({
      pretty: true,
    }),
    babel(),
  ],
};
