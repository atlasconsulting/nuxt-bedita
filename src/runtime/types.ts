import type { ApiResponseBodyOk, JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export type UserAuth = {
  data: JsonApiResourceObject & { id: string };
  roles?: string[]
}

export interface UserDataStore {
  id: string,
  name: string | null,
  surname: string | null,
  username: string | null,
  email: string | null,
  roles: string[],
}

export interface ApiResponseBodyResource extends ApiResponseBodyOk {
    formattedData?: {
        data: JsonApiResourceObject | {},
    },
}

export interface ApiResponseBodyList extends ApiResponseBodyOk {
    formattedData?: {
        data: JsonApiResourceObject[] | [],
    },
}

export type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};
