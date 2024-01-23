export {};

declare global {
  interface EntityErrorMessageInterface {
    message?: string;
    path?: string;
    code?: number;
  }

  interface ApiError {
    errors?: Array<EntityErrorMessageInterface>;
    status?: number;
    message?: string;
    id?: string;
  }
}
