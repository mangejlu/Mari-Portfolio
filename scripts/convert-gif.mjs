import { createRequire } from 'node:module';
import { mkdirSync, statSync } from 'node:fs';
const sharp = createRequire(import.meta.url)('sharp');

const SRC = '/Users/mangejlu/Documents/Claude/Case Study Images/BloomWatch/demo.gif';
const OUT_DIR = 'public/media';
mkdirSync(OUT_DIR, { recursive: true });

const meta = await sharp(SRC, { animated: true, limitInputPixels: false }).metadata();
const { width, pageHeight: h, pages } = meta;

// 60fps is a screen-recorder artifact, not something anyone needs to see.
// Keeping every 5th frame gives 12fps, which reads as smooth for UI motion
// and cuts the payload by 80% before compression even starts.
const STRIDE = 5;
const keep = [];
for (let i = 0; i < pages; i += STRIDE) keep.push(i);

console.log(`source: ${width}x${h}, ${pages} frames -> keeping ${keep.length} @ ~12fps`);

// Pull the kept frames out of the unrolled filmstrip and stack them again.
const raw = await sharp(SRC, { animated: true, limitInputPixels: false })
  .raw().toBuffer({ resolveWithObject: true });
const channels = raw.info.channels;
const frameBytes = width * h * channels;
const out = Buffer.alloc(frameBytes * keep.length);
keep.forEach((f, i) => raw.data.copy(out, i * frameBytes, f * frameBytes, (f + 1) * frameBytes));

await sharp(out, {
  raw: { width, height: h * keep.length, channels },
  limitInputPixels: false,
})
  .webp({ quality: 55, effort: 5, loop: 0, delay: STRIDE * 16 })
  .toFile(`${OUT_DIR}/bloomwatch-demo.webp`);

// A poster frame, so the animation only downloads if someone asks for it.
await sharp(raw.data.subarray(0, frameBytes), { raw: { width, height: h, channels } })
  .webp({ quality: 82 })
  .toFile(`${OUT_DIR}/bloomwatch-poster.webp`);

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2) + ' MB';
console.log('animated:', mb(`${OUT_DIR}/bloomwatch-demo.webp`));
console.log('poster:  ', mb(`${OUT_DIR}/bloomwatch-poster.webp`));
console.log('original: 39.53 MB');
