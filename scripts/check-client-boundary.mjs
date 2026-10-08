import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
if (tracked.some(file => /(^|\/)\.env(?:\.|$)/.test(file) && !file.endsWith('.env.example'))) throw new Error('A local environment file is tracked.');
const example = fs.readFileSync('.env.example', 'utf8');
if (/OPENAI_API_KEY|CLOUDFLARE_ACCESS_AUD|SERVICE_ROLE|PRIVATE_KEY/.test(example)) throw new Error('Client example must contain only public client settings.');
const local = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
const secrets = local.split(/\r?\n/).filter(line => /^[A-Z0-9_]*(?:API_KEY|ADMIN_KEY|SERVICE_ROLE_KEY|ACCESS_TOKEN|SECRET[A-Z0-9_]*|PRIVATE_KEY[A-Z0-9_]*)=/.test(line)).map(line => line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '')).filter(value => value.length > 10);
const files = [...tracked.filter(file => fs.existsSync(file))];
function walk(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) walk(file); else files.push(file); } }
for (const artifact of process.argv.slice(2)) { if (fs.statSync(artifact).isDirectory()) walk(artifact); else files.push(artifact); }
for (const file of files) {
  const bytes = fs.readFileSync(file);
  if (secrets.some(secret => bytes.includes(Buffer.from(secret)))) throw new Error('Provider credential detected in client source or artifact.');
}
console.log(`Client boundary checked: ${files.length} files; no copied provider key present.`);

