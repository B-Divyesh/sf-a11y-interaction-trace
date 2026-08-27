import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function findZips(directory) {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await findZips(path));
    else if (entry.name.endsWith('.zip')) results.push(path);
  }
  return results;
}

const zips = await findZips('.output').catch(() => []);
if (!zips.length) throw new Error('No packaged extension found. Run npm run build:extension first.');
const source = zips.sort().at(-1);
await mkdir('dist/site/downloads', { recursive: true });
await copyFile(source, 'dist/site/downloads/a11y-interaction-trace.zip');
console.log(`Staged ${source} → dist/site/downloads/a11y-interaction-trace.zip`);
