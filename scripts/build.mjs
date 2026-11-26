import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const cleanOnly = process.argv.includes('--clean');

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function copyIfPresent(source, destination) {
  if (await exists(source)) {
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(source, destination, { recursive: true, force: true });
  }
}

await rm(distDir, { recursive: true, force: true });
if (cleanOnly) {
  console.log('Removed dist/.');
  process.exit(0);
}

await mkdir(distDir, { recursive: true });

// Mirror the GitHub Pages publishing layout: repository root is the web root.
for (const file of ['index.html', 'manifest.json', 'sw.js', 'offline.html']) {
  await copyIfPresent(path.join(rootDir, file), path.join(distDir, file));
}
await copyIfPresent(path.join(rootDir, 'icons'), path.join(distDir, 'icons'));
await copyIfPresent(path.join(rootDir, 'pages'), path.join(distDir, 'pages'));
await copyIfPresent(path.join(rootDir, 'pages', '404.html'), path.join(distDir, '404.html'));

// Keep source-relative paths intact so index.html works in dist/ without rewriting.
await copyIfPresent(path.join(rootDir, 'src'), path.join(distDir, 'src'));

for (const requiredFile of ['index.html', 'manifest.json', 'sw.js', 'offline.html']) {
  if (!(await exists(path.join(distDir, requiredFile)))) {
    throw new Error(`Build failed: required deployment file "${requiredFile}" is missing.`);
  }
}

console.log('Build completed: dist/ mirrors the static GitHub Pages root.');
