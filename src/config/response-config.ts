import { ResponseStatus } from '../services/response-service';

export const RESPONSE_MESSAGES: Record<ResponseStatus, { message: string }> = {
  [ResponseStatus.UNAUTHORIZED]: { message: 'Authentication Failure' },
  [ResponseStatus.MANY_REQUESTS]: { message: 'Too Many Requests' },
  [ResponseStatus.NOT_FOUND]: { message: 'Not Found' },
  [ResponseStatus.FORBIDDEN]: { message: 'Forbidden' },
  [ResponseStatus.BAD_REQUEST]: { message: 'Bad Request' },
  [ResponseStatus.INTERNAL_ERROR]: { message: 'Internal Server' },
  [ResponseStatus.SUCCESS]: { message: 'Success' },
  [ResponseStatus.ACCESS_TOKEN_INVALID]: { message: 'Access token invalid' },
};
