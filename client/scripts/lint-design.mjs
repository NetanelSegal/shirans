/**
 * Fails when a source file styles something outside the design tokens.
 *
 * tailwind.config.js already drops Tailwind's default palette, radii and
 * shadows, so `bg-gray-500` renders nothing — but it renders nothing silently.
 * This makes the mistake loud, and also catches the escape hatches Tailwind
 * can't: arbitrary values (`text-[#ccbebc]`) and hex colors in code.
 *
 * The fix is always the same: use a role from src/styles/tokens.css, or add
 * one there.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLIENT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(CLIENT_DIR, 'src');
const TOKENS_FILE = join(SRC_DIR, 'styles', 'tokens.css');

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const RULES = [
  {
    name: 'Tailwind default palette',
    pattern: new RegExp(`\\b[a-z]+-(${PALETTE})-\\d{2,3}\\b`, 'g'),
  },
  {
    name: 'arbitrary color value',
    pattern: /\b[a-z]+-\[(#|rgb|hsl)[^\]]*\]/g,
  },
  {
    name: 'hex color',
    pattern: /['"`]#[0-9a-fA-F]{3,8}['"`]/g,
  },
  {
    name: 'radius or shadow outside the tokens',
    pattern: /(?<![\w-])(rounded-(sm|md|lg|xl|2xl|3xl)|shadow-(sm|md|lg|xl|2xl)|shadow-\[[^\]]+\])(?![\w-])/g,
  },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (['.ts', '.tsx', '.css'].includes(extname(path))) out.push(path);
  }
  return out;
}

const problems = [];
for (const file of walk(SRC_DIR)) {
  if (file === TOKENS_FILE) continue;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      for (const { name, pattern } of RULES) {
        for (const match of line.matchAll(pattern)) {
          problems.push(`${relative(CLIENT_DIR, file)}:${index + 1}  ${match[0]}  (${name})`);
        }
      }
    });
}

if (problems.length) {
  console.error(`Off-token styling (${problems.length}):\n  ${problems.join('\n  ')}`);
  console.error('\nUse a role from src/styles/tokens.css, or add one there.');
  process.exit(1);
}
console.log('lint:design — every style comes from the tokens.');
