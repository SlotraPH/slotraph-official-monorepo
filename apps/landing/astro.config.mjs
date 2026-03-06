import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse root .env using only Node built-ins (no vite/dotenv dependency)
function parseEnvFile(filePath) {
  const vars = {};
  if (!fs.existsSync(filePath)) return vars;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*)\s*$/);
    if (m) vars[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return vars;
}

const rootEnv = parseEnvFile(path.resolve(__dirname, '../../.env'));
const appEnv = parseEnvFile(path.resolve(__dirname, '.env'));
const resolvedEnv = { ...rootEnv, ...appEnv, ...process.env };

export default defineConfig({
  integrations: [react()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tl'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      __SUPABASE_URL__:       JSON.stringify(resolvedEnv.VITE_SUPABASE_URL       ?? ''),
      __SUPABASE_ANON_KEY__:  JSON.stringify(resolvedEnv.VITE_SUPABASE_ANON_KEY  ?? ''),
      __TURNSTILE_SITE_KEY__: JSON.stringify(resolvedEnv.VITE_TURNSTILE_SITE_KEY ?? ''),
      __POSTHOG_KEY__:        JSON.stringify(resolvedEnv.VITE_POSTHOG_KEY        ?? ''),
    },
  },
});
