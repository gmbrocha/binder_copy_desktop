import fs from 'node:fs';
const required = ['AGENTS.md','CURRENT_STATE.md','README.md','docs/PRODUCT.md','docs/ARCHITECTURE.md','docs/ROADMAP.md','docs/DECISIONS.md','docs/VERIFICATION.md','docs/RELEASE_CHECKLIST.md','docs/SOURCE_BASELINE.json'];
for (const file of required) if (!fs.existsSync(file) || !fs.readFileSync(file,'utf8').trim()) throw Error('Missing or empty required document: '+file);
const state=fs.readFileSync('CURRENT_STATE.md','utf8');
for (const heading of ['Objective','Verified state','Active work','Blockers','Next actions','Verification','Last checkpoint']) if (!state.includes('## '+heading)) throw Error('Missing CURRENT_STATE section: '+heading);
console.log('Documentation structure and state sections verified. This is not a native build or deployment check.');
