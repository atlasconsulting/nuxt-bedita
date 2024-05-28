import type { SessionConfig } from 'h3';
import { useRuntimeConfig } from '#imports';

export const getSessionConfig = (): SessionConfig => {
  const config = useRuntimeConfig();

  return {
    password: config.bedita.session.secret,
    name: config.bedita.session.name,
  } as SessionConfig;
};
