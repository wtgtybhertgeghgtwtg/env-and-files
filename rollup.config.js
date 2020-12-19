import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import builtinModules from 'builtin-modules';
import package_ from './package.json';

export default {
  external: [...builtinModules, ...Object.keys(package_.dependencies)],
  input: 'src/index.ts',
  output: [
    {
      exports: 'auto',
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
  ],
  plugins: [
    babel({babelHelpers: 'bundled', extensions: ['.ts']}),
    nodeResolve({extensions: ['.ts']}),
  ],
};
