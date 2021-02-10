import filesize from 'rollup-plugin-filesize'

import packageJson from './package.json'

export default {
  input: 'src/index.js',
  output: [
    { file: packageJson.main, format: 'cjs' },
    { file: packageJson.module, format: 'esm' }
  ],
  plugins: [filesize(), mjs()]
}

/**
 * Tiny plugin to generate .mjs wrappers for each entry point.
 */
function mjs() {
  return {
    name: 'rollup-plugin-mjs',
    generateBundle(options, bundle) {
      if (options.format !== 'cjs') return
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName]
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue
        const names = chunk.exports.join(',\n  ')
        this.emitFile({
          type: 'asset',
          fileName: fileName.replace(/\.js$/, '') + '.mjs',
          source: `import cjs from './${fileName}';\n\nexport const {\n  ${names}\n} = cjs;\n`
        })
      }
    }
  }
}
