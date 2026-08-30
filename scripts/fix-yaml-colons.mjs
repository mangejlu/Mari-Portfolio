/**
 * In YAML, an unquoted list item containing ": " parses as a mapping, not a
 * string, and the build fails with a confusing type error. Prose with colons
 * in it is completely normal, so this quotes those items instead of asking
 * anyone to remember the rule.
 *
 * Run after editing content: node scripts/fix-yaml-colons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync('src/content/**/*.md');
let fixed = 0;

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let inFrontmatter = false;
  let seen = 0;

  const out = lines.map((line) => {
    if (line.trim() === '---') { seen += 1; inFrontmatter = seen === 1; return line; }
    if (!inFrontmatter) return line;

    const m = line.match(/^(\s*)- (?!["'])(.*)$/);
    if (!m || !m[2].includes(': ')) return line;

    // Leave real key: value entries alone; only quote prose.
    if (/^[a-zA-Z_][a-zA-Z0-9_]*:\s/.test(m[2])) return line;

    fixed += 1;
    return `${m[1]}- "${m[2].replace(/"/g, '\\"')}"`;
  });

  writeFileSync(file, out.join('\n'));
}
console.log(fixed ? `quoted ${fixed} list item(s) containing ": "` : 'nothing to fix');
