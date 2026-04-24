/**
 * @astrojs/vercel 7.x maps unknown Node majors (e.g. 22) to nodejs18.x.
 * Vercel may reject nodejs18.x for new deployments — normalize to nodejs20.x.
 * Safe no-op when .vercel/output is missing (e.g. Netlify build → dist/).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outRoot = join(process.cwd(), '.vercel', 'output', 'functions');
if (!existsSync(outRoot)) {
  process.exit(0);
}

/** @param {string} dir */
function walkVcConfigs(dir) {
  /** @type {string[]} */
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) files.push(...walkVcConfigs(full));
    else if (name === '.vc-config.json') files.push(full);
  }
  return files;
}

let patched = 0;
for (const file of walkVcConfigs(outRoot)) {
  const raw = readFileSync(file, 'utf8');
  const json = JSON.parse(raw);
  if (json.runtime === 'nodejs18.x') {
    json.runtime = 'nodejs20.x';
    writeFileSync(file, `${JSON.stringify(json, null, '\t')}\n`);
    patched += 1;
  }
}

if (patched) {
  console.info(`[fix-vercel-node-runtime] Patched ${patched} serverless function(s) to nodejs20.x`);
}
