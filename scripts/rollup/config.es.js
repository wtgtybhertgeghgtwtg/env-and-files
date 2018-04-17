import assignDeep from 'assign-deep';
import cjsConfig from './config.cjs';
import pkg from '../../package.json';

export default assignDeep({}, cjsConfig, {
  output: {file: pkg.module, format: 'es'},
});
