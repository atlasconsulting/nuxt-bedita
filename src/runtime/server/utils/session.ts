import type { H3Event, SessionConfig } from 'h3';
import { useRuntimeConfig } from '#imports';

export const getSessionConfig = (event: H3Event): SessionConfig => {
  const config = useRuntimeConfig(event);

  return {
    password: config.bedita.session.secret,
    name: config.bedita.session.name,
  } as SessionConfig;
};
