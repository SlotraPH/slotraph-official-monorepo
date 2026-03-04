/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_OWNER_AUTH_MODE?: 'bypass' | 'mock-session';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
