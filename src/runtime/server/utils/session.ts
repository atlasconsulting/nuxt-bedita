import type { SessionConfig } from 'h3';

export const getSessionConfig = (): SessionConfig => {
    const config = useRuntimeConfig();

    return {
        password: config.bedita.session.secret,
        name: config.bedita.session.name,
    } as SessionConfig;
}
