import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { TextDecoder } from 'node:util';
const required = ['AGENTS.md','CURRENT_STATE.md','README.md','docs/PRODUCT.md','docs/ARCHITECTURE.md','docs/ROADMAP.md','docs/DECISIONS.md','docs/VERIFICATION.md','docs/RELEASE_CHECKLIST.md','docs/SOURCE_BASELINE.json'];
for (const file of required) if (!fs.existsSync(file) || !fs.readFileSync(file,'utf8').trim()) throw Error('Missing or empty required document: '+file);
const state=fs.readFileSync('CURRENT_STATE.md','utf8');
for (const heading of ['Objective','Verified state','Active work','Blockers','Next actions','Verification','Last checkpoint']) if (!state.includes('## '+heading)) throw Error('Missing CURRENT_STATE section: '+heading);
console.log('Documentation structure and state sections verified. This is not a native build or deployment check.');

// Include every tracked Markdown document, not only scaffold entry points.
const documents = execFileSync('git', ['ls-files', '-z', '*.md'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const decoder = new TextDecoder('utf-8', { fatal: true });
for (const file of documents) {
  if (!fs.existsSync(file)) continue; // A staged deletion is valid.
  let text;
  try { text = decoder.decode(fs.readFileSync(file)); }
  catch { throw Error('Document is not valid UTF-8: ' + file); }
  if (!text.trim()) throw Error('Empty tracked document: ' + file);
  if (text.includes('\uFFFD') || text.includes('\0')) throw Error('Malformed document text: ' + file);
}
console.log(`Validated UTF-8 and nonempty content in ${documents.length} tracked Markdown files.`);
