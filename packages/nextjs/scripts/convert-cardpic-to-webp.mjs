import fs from "node:fs/promises";
import path from "node:path";

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const v = process.argv[idx + 1];
  if (!v || v.startsWith("--")) return fallback;
  return v;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

const INPUT_DIR = path.resolve(getArg("--input", "./utils/cardpic"));
const PUBLIC_OUT_DIR = path.resolve(getArg("--publicOut", "./public/cardpic_webp"));
const QUALITY = Number(getArg("--quality", "60"));
const MAX_WIDTH = Number(getArg("--maxWidth", "900")); // 0 = keep original size
const OVERWRITE = hasFlag("--overwrite") || true;

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch (e) {
  console.error(
    "[convert-cardpic-to-webp] Missing dependency 'sharp'.\n" +
      "Run: pnpm --filter ./packages/nextjs add -D sharp\n" +
      "Then rerun: pnpm --filter ./packages/nextjs images:webp\n",
  );
  process.exit(1);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function listPngFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter(e => e.isFile() && e.name.toLowerCase().endsWith(".png"))
    .map(e => path.join(dir, e.name))
    .sort();
}

async function convertOne(inputPath) {
  const base = path.basename(inputPath, path.extname(inputPath));
  const publicOutPath = path.join(PUBLIC_OUT_DIR, `${base}.webp`);

  if (!OVERWRITE) {
    try {
      await fs.access(publicOutPath);
      return { inputPath, outPath, skipped: true };
    } catch {
      // continue
    }
  }

  let img = sharp(inputPath, { failOnError: false });
  if (Number.isFinite(MAX_WIDTH) && MAX_WIDTH > 0) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // WebP: quality 0..100; effort 0..6 (higher = smaller but slower)
  const buf = await img.webp({ quality: QUALITY, effort: 6 }).toBuffer();

  await fs.writeFile(publicOutPath, buf);

  return { inputPath, outPath: publicOutPath, skipped: false, bytes: buf.byteLength };
}

function prettyBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)}${units[i]}`;
}

async function main() {
  if (!Number.isFinite(QUALITY) || QUALITY < 1 || QUALITY > 100) {
    throw new Error(`Invalid --quality=${QUALITY}. Expected 1..100`);
  }
  if (!Number.isFinite(MAX_WIDTH) || MAX_WIDTH < 0) {
    throw new Error(`Invalid --maxWidth=${MAX_WIDTH}. Expected >= 0`);
  }

  await ensureDir(OUT_DIR);
  await ensureDir(PUBLIC_OUT_DIR);

  const files = await listPngFiles(INPUT_DIR);
  if (!files.length) {
    console.log(`[convert-cardpic-to-webp] No .png files found in ${INPUT_DIR}`);
    return;
  }

  console.log(`[convert-cardpic-to-webp] input=${INPUT_DIR}`);
  console.log(`[convert-cardpic-to-webp] publicOut=${PUBLIC_OUT_DIR}`);
  console.log(`[convert-cardpic-to-webp] quality=${QUALITY} maxWidth=${MAX_WIDTH}`);

  let totalBytes = 0;
  let converted = 0;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const res = await convertOne(f);
    if (!res.skipped) {
      converted++;
      totalBytes += res.bytes ?? 0;
    }
    if ((i + 1) % 10 === 0 || i === files.length - 1) {
      console.log(`[convert-cardpic-to-webp] ${i + 1}/${files.length} done`);
    }
  }

  console.log(
    `[convert-cardpic-to-webp] converted=${converted}/${files.length} totalWritten=${prettyBytes(totalBytes)}`,
  );
}

await main();


