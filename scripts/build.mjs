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
await copyIfPresent(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
await copyIfPresent(path.join(rootDir, 'public'), distDir);
await copyIfPresent(path.join(rootDir, 'pages'), path.join(distDir, 'pages'));
await copyIfPresent(path.join(rootDir, 'pages', '404.html'), path.join(distDir, '404.html'));
await copyIfPresent(path.join(rootDir, 'src', 'assets'), path.join(distDir, 'assets'));
await copyIfPresent(path.join(rootDir, 'src', 'css'), path.join(distDir, 'assets', 'css'));
await copyIfPresent(path.join(rootDir, 'src', 'js'), path.join(distDir, 'assets', 'js'));

if (!(await exists(path.join(distDir, 'index.html')))) {
  throw new Error('Build failed: index.html was not found at the project root.');
}

console.log('Build completed: dist/ is ready for static hosting.');
