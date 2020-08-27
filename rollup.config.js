import filesize from 'rollup-plugin-filesize'

import packageJson from './package.json'

export default {
  input: 'src/index.js',
  output: { file: packageJson.main, format: 'cjs', sourcemap: true },
  plugins: [mjs(), filesize()]
}

/**
 * Tiny plugin to generate .mjs wrappers for each entry point.
 */
function mjs() {
  return {
    name: 'rollup-plugin-mjs',
    generateBundle(options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName]
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue
        this.emitFile({
          type: 'asset',
          fileName: fileName.replace(/js$/, 'mjs'),
          source: `export { ${chunk.exports.join(', ')} } from './${fileName}'`
        })
      }
    }
  }
}
