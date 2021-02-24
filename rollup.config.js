import filesize from 'rollup-plugin-filesize'
import mjs from 'rollup-plugin-mjs-entry'

import packageJson from './package.json'

export default {
  input: './src/index.js',
  output: { file: packageJson.main, format: 'cjs' },
  plugins: [filesize(), mjs()]
}
