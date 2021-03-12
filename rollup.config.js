import babel from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'
import mjs from 'rollup-plugin-mjs-entry'

import packageJson from './package.json'

const babelOpts = {
  babelrc: false,
  presets: [['@babel/preset-env', { loose: true }]],
  plugins: [['@babel/plugin-transform-for-of', { assumeArray: true }]]
}

export default {
  input: './src/index.js',
  output: [
    { file: packageJson.main, format: 'cjs' },
    { file: packageJson.module, format: 'es' }
  ],
  plugins: [babel(babelOpts), filesize(), mjs()]
}
