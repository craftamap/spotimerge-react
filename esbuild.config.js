const esbuild = require('esbuild')

const watch = process.argv.includes('--watch')
const development = process.argv.includes('--development')
const serve = process.argv.includes('--serve')

const { htmlPlugin } = require('@craftamap/esbuild-plugin-html')

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
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: [
            'src/index.jsx',
          ],
          filename: 'index.html',
          htmlTemplate: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <div id="root">
                </div>
            </body>
            </html>
          `,
        },
        {
          entryPoints: [
            'src/auth-flow-response.js',
          ],
          filename: 'auth-flow-response.html',
        },
      ],
    }),
  ],
}

if (serve) {
  esbuild.serve({
    servedir: 'dist',
    port: 8000,
  }, options)
} else {
  esbuild.build(options).catch(() => process.exit(1))
}
