import type { ApiResponseBodyOk, JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export interface UserDataStore {
  id: string,
  name: string,
  surname: string,
  email: string,
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

