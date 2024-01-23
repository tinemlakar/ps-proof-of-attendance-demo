export interface ConfigInterface {
  APP_URL: string;
  API_BASE: string;
  CHAIN_ID: string;
}

export type AuthResponseProfile = {
  id: number;
  authUser: {
    id: number;
    status: number;
    username: string;
    email?: string;
    roles: any[];
    permissions: any[];
  };
};

export type AuthResponse = {
  profile: AuthResponseProfile;
  authToken: {
    status: boolean;
    data: string;
  };
};

/** Response */
type GeneralResponse<T> = {
  data: T;
  id: string;
  status: number;
};
type GeneralItemsResponse<T> = {
  data: {
    items: Array<T>;
    total: number;
  };
  id: string;
  status: number;
};
type SuccessResponse = GeneralResponse<{ success: boolean }>;

interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  order?: string;
  loader?: boolean;
}
