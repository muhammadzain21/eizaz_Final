import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Jimp from 'jimp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function ensurePngIcon() {
  const projectRoot = path.join(__dirname, '..')
  const pub = path.join(projectRoot, 'public')
  const outPng = path.join(pub, 'hospital_icon.png')

  // Skip if PNG already exists
  if (fs.existsSync(outPng)) {
    console.log('[make-icns] public/hospital_icon.png already exists; skipping generation')
    return
  }

  // Find a source image
  const candidates = [
    path.join(pub, 'hospital_icon.jpeg'),
    path.join(pub, 'hospital_icon.jpg'),
    path.join(pub, 'hospital_icon.ico'),
  ]
  const src = candidates.find(p => { try { return fs.existsSync(p) } catch { return false } })
  if (!src) {
    console.log('[make-icns] No source icon found; skipping PNG generation')
    return
  }

  // Generate a high-res PNG (512x512 for macOS icon)
  const base = await Jimp.read(src)
  base.contain(512, 512, Jimp.RESIZE_BILINEAR)
  await base.writeAsync(outPng)
  console.log('[make-icns] Wrote', outPng)
}

ensurePngIcon().catch((e) => {
  console.error('[make-icns] failed:', e?.message || e)
  process.exit(1)
})
