// Fail before spending runner time or signing a binary with preview configuration.
export function checkReleaseConfig(env) {
  const api = new URL(env.BINDERCOPY_API_URL ?? '');
  if (api.protocol !== 'https:' || api.username || api.password || api.pathname !== '/' || api.search || api.hash || !api.hostname.includes('.') || /(?:^|\.)(?:localhost|local|invalid|test)$/.test(api.hostname) || /^[\d.]+$/.test(api.hostname)) throw new Error('A public production HTTPS API origin is required.');
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(env.BINDERCOPY_AUTH_URL ?? '')) throw new Error('The exact Supabase project URL is required.');
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(env.BINDERCOPY_PUBLISHABLE_KEY ?? '')) throw new Error('Only the public Supabase publishable key belongs in the app.');
  if (!/^[1-9][0-9]*$/.test(env.BINDERCOPY_BUILD_NUMBER ?? '')) throw new Error('A positive, previously unused build number is required.');
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/check-release-config.mjs')) {
  checkReleaseConfig(process.env);
  console.log('Public release configuration validated; this does not prove signing, live API health or TestFlight availability.');
}
