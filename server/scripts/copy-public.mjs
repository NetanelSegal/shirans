/**
 * Cross-platform copy of server/public → dist/server/public (replaces shx/cp -r).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, '..');
const src = path.join(serverRoot, 'public');
const dest = path.join(serverRoot, 'dist', 'server', 'public');

if (!fs.existsSync(src)) {
  console.warn(`copy-public: skip — missing ${src}`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
