const esbuild = require('esbuild')
const fs = require('fs/promises')
const { htmlPlugin } = require('@craftamap/esbuild-plugin-html')
const svgrPlugin = require('esbuild-plugin-svgr')

const exec = async () => {
  const watch = process.argv.includes('--watch')
  const development = process.argv.includes('--development')
  const serve = process.argv.includes('--serve')

  const indexContent = await fs.readFile('./public/index.html')
  const authContent = await fs.readFile('./public/auth-flow-response.html')

  const options = {
    entryPoints: ['src/index.jsx', 'src/auth-flow-response.js'],
    bundle: true,
    outdir: 'dist/',
    watch: watch,
    minify: !development,
    sourcemap: development,
    entryNames: '[dir]/[name]-[hash]',
    logLevel: 'debug',
    metafile: true,
    define: {
      CLIENT_ID: process.env.CLIENT_ID ? `"${process.env.CLIENT_ID}"` : '"122f5228c6eb45ad865922a575c4a998"',
      REDIRECT_URI: process.env.REDIRECT_URI ? `"${process.env.REDIRECT_URI}"` : '"http://localhost:8000/auth-flow-response.html"',
    },
    plugins: [
      svgrPlugin(),
      htmlPlugin({
        files: [
          {
            entryPoints: [
              'src/index.jsx',
            ],
            filename: 'index.html',
            htmlTemplate: indexContent,
            title: 'spotimerge',
          },
          {
            entryPoints: [
              'src/auth-flow-response.js',
            ],
            filename: 'auth-flow-response.html',
            htmlTemplate: authContent,
          },
        ],
      }),
    ],
  }
  if (serve) {
    await esbuild.serve({
      servedir: 'dist',
      port: 8000,
    }, options)
  } else {
    await esbuild.build(options)
      .catch(() => process.exit(1))
  }
}

exec()
