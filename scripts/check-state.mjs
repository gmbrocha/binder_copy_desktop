import {execFileSync} from 'node:child_process';
const names=execFileSync('git',['diff','--cached','--name-only'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
if(names.length && !names.includes('CURRENT_STATE.md')) { console.error('Update and stage CURRENT_STATE.md with verified progress, tests, blockers and the next action before committing. Do not fabricate state.'); process.exit(1); }
