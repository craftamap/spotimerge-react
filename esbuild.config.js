const esbuild = require('esbuild')
const fs = require('fs/promises')

const watch = process.argv.includes('--watch')
const development = process.argv.includes('--development')
const serve = process.argv.includes('--serve')

const copyPlugin = {
  name: 'copy',
  setup (build) {
    build.onStart(() => {
      console.log('copying files...');
      (async () => {
        await fs.copyFile('public/index.html', 'dist/index.html')
        await fs.copyFile('public/auth-flow-response.html', 'dist/auth-flow-response.html')
      })()
    })
  },
}

const options = {
  entryPoints: ['src/index.jsx', 'src/auth-flow-response.js'],
  bundle: true,
  outdir: 'dist/',
  watch: watch,
  minify: !development,
  sourcemap: development,
  plugins: [copyPlugin],
}

if (serve) {
  esbuild.serve({
    servedir: 'dist',
    port: 8000,
  }, options)
} else {
  esbuild.build(options).catch(() => process.exit(1))
}
