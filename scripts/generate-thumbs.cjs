const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const videosDir = path.join(__dirname, '..', 'public', 'videos');
const outDir = path.join(videosDir, 'thumbnails');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function hasFfmpeg() {
  const res = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  return res.status === 0 || res.status === null;
}

function buildThumbnail(file) {
  const input = path.join(videosDir, file);
  const name = path.parse(file).name;
  const outName = `${name}.jpg`;
  const outPath = path.join(outDir, outName);

  // Extract a frame at 1 second.
  const args = ['-y', '-ss', '00:00:01', '-i', input, '-frames:v', '1', outPath];
  console.log('Running ffmpeg for', file);
  const res = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (res.error || res.status !== 0) {
    console.error('ffmpeg failed for', file);
    return false;
  }
  return true;
}

function main() {
  if (!fs.existsSync(videosDir)) {
    console.error('No videos directory found at', videosDir);
    process.exit(1);
  }

  ensureDir(outDir);

  if (!hasFfmpeg()) {
    console.error('ffmpeg not found on PATH. Install ffmpeg to generate thumbnails.');
    process.exit(2);
  }

  const files = fs.readdirSync(videosDir).filter((f) => /\.mp4$/i.test(f));
  if (files.length === 0) {
    console.log('No mp4 files found in', videosDir);
    return;
  }

  files.forEach((f) => buildThumbnail(f));
  console.log('Thumbnail generation complete. Thumbnails are in', outDir);
}

main();
