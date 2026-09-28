import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(path.join(dir, 'logo.svg'))
const sizes = [16, 32, 48, 128]
const outDir = path.join(dir, '..', 'public', 'icons')

for (const size of sizes) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, `icon${size}.png`))
  console.log('generated', size)
}
