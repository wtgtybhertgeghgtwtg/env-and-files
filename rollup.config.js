import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import builtinModules from 'builtin-modules';
import {dependencies} from './package.json';

export default {
  external: [...builtinModules, ...Object.keys(dependencies)],
  input: 'source/index.ts',
  output: [
    {
      dir: 'dist',
      entryFileNames: '[name].[format].js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      dir: 'dist',
      entryFileNames: '[name].[format].js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [nodeResolve({extensions: ['.ts']}), typescript()],
};
