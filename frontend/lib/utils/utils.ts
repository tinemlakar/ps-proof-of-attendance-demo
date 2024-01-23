import dev from '../config/development';
import stg from '../config/staging';
import prod from '../config/production';
import {
  Environments,
  ON_COLUMN_CLICK_OPEN_CLASS,
  PAGINATION_LIMIT,
} from '../values/general.values';
import { ConfigInterface } from 'lib/types/general.types';

/** Check if any of elements contains class ${ON_COLUMN_CLICK_OPEN_CLASS}, which means this column is clickable */
export function canOpenColumnCell(path: EventTarget[]) {
  return path.some(
    (item: EventTarget) => (item as HTMLElement)?.className?.includes(ON_COLUMN_CLICK_OPEN_CLASS)
  );
}

export function getConfig(): ConfigInterface {
  const env = process.env.ENV ? process.env.ENV : process.env.NODE_ENV;

  let CONFIG = dev;
  if (env === Environments.prod) {
    CONFIG = prod;
  } else if (env === Environments.stg) {
    CONFIG = stg;
  }

  return CONFIG;
}

export function apiErrorToMsg(error: any) {
  if (instanceOfApiError(error)) {
    const apiError = error as ApiError;
    if (apiError.message) return apiError.message;

    if (apiError.errors?.length) {
      const firstErr = apiError.errors.find((x: any) => x.message);
      if (firstErr && firstErr.message) {
        let tmpMsg = firstErr.message.toLocaleLowerCase().replaceAll('_', ' ');
        tmpMsg = tmpMsg.charAt(0).toUpperCase() + tmpMsg.slice(1);

        return tmpMsg;
      }
    }
  }
  return '';
}

function instanceOfApiError(object: any): object is ApiError {
  return 'status' in object && ('errors' in object || 'message' in object);
}

export function parseArguments(args: FetchParams): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  params.itemsPerPage = args.limit || PAGINATION_LIMIT;

  if (args.search) {
    params.search = args.search;
  }
  if (args.page) {
    params.page = args.page;
  }
  if (args.orderBy) {
    params.orderBy = args.orderBy;
  }
  if (args.order) {
    params.desc = args.order === 'descend' ? 'true' : 'false';
  }
  return params;
}
