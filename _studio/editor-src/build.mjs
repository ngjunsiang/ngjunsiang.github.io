import * as esbuild from 'esbuild'
import { cpSync, mkdirSync, existsSync } from 'node:fs'

const outdir = new URL('../public/bundles/', import.meta.url).pathname

await esbuild.build({
  entryPoints: ['src/cm.js', 'src/milkdown.js'],
  outdir,
  bundle: true,
  format: 'esm',
  minify: true,
  logLevel: 'info',
  loader: {
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.svg': 'file',
    '.png': 'file',
    '.jpg': 'file',
  },
})

console.log('Bundles written to', outdir)
