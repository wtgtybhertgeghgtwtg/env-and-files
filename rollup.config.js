// @flow
import builtinModules from 'builtin-modules';
import babel from 'rollup-plugin-babel';
import closureCompilerJs from 'rollup-plugin-closure-compiler-js';
import prettier from 'rollup-plugin-prettier';
import pkg from './package.json';

export default {
  external: [...builtinModules, ...Object.keys(pkg.dependencies)],
  input: 'src/index.js',
  output: {file: pkg.main, format: 'cjs', sourcemap: true},
  plugins: [
    babel(),
    closureCompilerJs({
      applyInputSourceMaps: false,
      assumeFunctionWrapper: true,
      compilationLevel: 'SIMPLE',
      env: 'CUSTOM',
      languageOut: 'ECMASCRIPT6_STRICT',
      processCommonJsModules: false,
      renaming: false,
      useTypesForOptimization: false,
    }),
    prettier(),
  ],
};
