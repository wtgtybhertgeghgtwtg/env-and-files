module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.NODE_ENV === 'test' && 'commonjs',
        targets: {node: '6'},
      },
    ],
    '@babel/preset-flow',
  ],
};
