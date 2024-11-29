import { ErrorType } from '../services/error-service';

export const ERROR_MESSAGES: Record<ErrorType, { message: string }> = {
  [ErrorType.BAD_TOKEN]: { message: 'Invalid token' },
  [ErrorType.TOKEN_EXPIRED]: { message: 'Token has expired' },
  [ErrorType.UNAUTHORIZED]: { message: 'Invalid credentials' },
  [ErrorType.ACCESS_TOKEN]: { message: 'Invalid access token' },
  [ErrorType.INTERNAL]: { message: 'Internal server error' },
  [ErrorType.NOT_FOUND]: { message: 'Resource not found' },
  [ErrorType.NO_ENTRY]: { message: 'No entry exists' },
  [ErrorType.NO_DATA]: { message: 'No data available' },
  [ErrorType.BAD_REQUEST]: { message: 'Bad request' },
  [ErrorType.FORBIDDEN]: { message: 'Access forbidden' },
  [ErrorType.MANY_REQUESTS]: { message: 'Too many requests' },
};
