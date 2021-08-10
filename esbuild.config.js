const esbuild = require("esbuild")
const fs = require("fs/promises")

esbuild.build({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    outdir: 'dist/',
    watch: true,
}).then(async _result => {
    await fs.copyFile("public/index.html", "dist/index.html")
}).catch(() => process.exit(1))
