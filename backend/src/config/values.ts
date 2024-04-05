export enum AppEnvironment {
  DEV = "development",
  TEST = "testing",
  STG = "staging",
  PROD = "production",
}

/**
 * Serialized strategy.
 */
export enum SerializedStrategy {
  PROFILE = "profile",
  DB = "db",
  EXTENDED_DB = "extended_db",
  UPDATE_DB = "update_db",
  ADMIN = "admin",
}

/**
 * Populate strategy.
 */
export enum PopulateStrategy {
  ADMIN = "admin",
  PROFILE = "profile",
  DB = "db",
}

/**
 * Default user roles
 */
export enum DefaultUserRoles {
  ADMIN = 1,
  USER = 2,
}

/**
 * Default pagination values.
 */
export enum PaginationValues {
  PAGE_MAX_LIMIT = 100,
  PAGE_DEFAULT_LIMIT = 25,
}

/**
 * Request Token types.
 */
export enum RequestToken {
  AUTH_ADMIN = "authAdmin",
  AIRDROP_EMAIL = "airdropEmail",
  DROP_RESERVATION = "dropReservation",
}

export enum AirdropStatus {
  PENDING = 1,
  EMAIL_SENT = 2,
  EMAIL_ERROR = 3,
  WALLET_LINKED = 4,
  TRANSACTION_CREATED = 5,
  AIRDROP_COMPLETED = 6,
  AIRDROP_ERROR = 7,
}

/**
 * System Error codes.
 */
export enum SystemErrorCode {
  UNHANDLED_SYSTEM_ERROR = 500000,
  DATABASE_ERROR = 500001,
  EMAIL_SENDING_ERROR = 500002,
}

/**
 * Authorization Error codes.
 */
export enum AuthorizationErrorCode {
  MISSING_AUTH_TOKEN = 403001,
  UNKNOWN_USER = 403002,
  UNAUTHORIZED = 403003,
  NOT_ACTIVATED = 403004,
  INVALID_TOKEN = 403005,
  TOKEN_EXPIRED = 403006,
}

/**
 * Validator Error codes.
 */
export enum ValidatorErrorCode {
  DEFAULT = 422000,
  POAP_DROP_REQUIRED_DATA_NOT_PRESENT = 422001,
  DROP_RESERVATION_REQUIRED_DATA_NOT_PRESENT = 422002,
  USERS_NOT_PRESENT = 422004,
  DATA_MODEL_STATUS_MISSING = 422100,
  DATA_MODEL_INVALID_STATUS = 422101,
}

/**
 * Route Error codes.
 */
export enum RouteErrorCode {
  INVALID_REQUEST = 400000,
  PROFILE_NOT_IDENTIFIED = 400001,
  PROFILE_CREDENTIALS_INVALID = 400002,
  REQUEST_TOKEN_INVALID = 400003,
  USER_DOES_NOT_EXIST = 400004,
  SIGNATURE_NOT_PRESENT = 400005,
  REQUEST_TOKEN_NOT_PRESENT = 400006,
  AIRDROP_ALREADY_CLAIMED = 400007,
  POAP_DROP_DOES_NOT_EXISTS = 400008,
  DROP_ALREADY_RESERVED = 400009,
  DROP_RESERVATION_DOES_NOT_EXISTS = 400010,
  INVALID_ADMIN = 400011,
}
