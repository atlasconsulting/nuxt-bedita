import type { ApiResponseBodyOk, JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export type UserAuth = {
  data: JsonApiResourceObject & { id: string };
  roles?: string[];
};

export type UserDataStore = {
  id: string;
  name: string | null;
  surname: string | null;
  username: string | null;
  email: string | null;
  roles: string[];
} & Record<string, any>;

export interface ApiResponseBodyResource extends ApiResponseBodyOk {
  formattedData?: {
    data: JsonApiResourceObject | Record<string, any>;
  };
}

export interface ApiResponseBodyList extends ApiResponseBodyOk {
  formattedData?: {
    data: JsonApiResourceObject[] | Record<string, any>[];
  };
}

export type RecaptchaResponse = {
  'success': boolean;
  'score'?: number;
  'action'?: string;
  'challenge_ts'?: string;
  'hostname'?: string;
  'error-codes'?: string[];
};

export type SignupBeditaBody = {
  username: string;
  password: string;
  email: string;
  name?: string;
  surname?: string;
} & Record<string, any>;

export type EndpointConf = 'auth' | 'signup';

export type ProxyEndpointConf = {
  path?: string;
  regExp?: string;
  methods: ('GET' | 'POST' | 'PATCH' | 'DELETE' | '*')[];
};

export type BeditaProjectConf = {
  apiBaseUrl: string;
  apiKey: string;
  replaceTranslations?: boolean;
};

export interface BeditaModuleOptions {
  apiBaseUrl: string;
  apiKey: string;
  projects?: Record<string, BeditaProjectConf>;
  auth: {
    global?: boolean;
    required?: boolean;
    unauthenticatedRedirect?: string;
    publicRoutes?: string[];
    rolesGuard?: Record<string, string[]>;
    sessionUserProps?: string[];
  };
  endpoints?: EndpointConf[];
  proxyEndpoints?: ProxyEndpointConf[];
  recaptcha: {
    enabled: boolean;
    siteKey?: string;
    secretKey?: string;
    hideBadge?: boolean;
    useRecaptchaNet?: boolean;
  };
  replaceTranslations?: boolean;
  resetPasswordPath?: string;
  session: {
    name: string;
    secret: string;
  };
};
