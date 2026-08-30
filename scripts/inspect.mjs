import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('sharp');
const p = '/Users/mangejlu/Documents/Claude/Case Study Images/BloomWatch/demo.gif';
const m = await sharp(p, { animated: true, limitInputPixels: false }).metadata();
const delays = m.delay || [];
const secs = delays.reduce((a, b) => a + b, 0) / 1000;
console.log('size:', m.width + 'x' + m.pageHeight, '| frames:', m.pages,
            '| duration:', secs.toFixed(1) + 's', '| fps:', (m.pages / secs).toFixed(1));
