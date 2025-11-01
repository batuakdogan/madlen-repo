import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types';


export const extractErrorMessage = (error: unknown): ApiError => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      success?: boolean;
      message?: string;
      error?: string;
    }>;

    const statusCode = axiosError.response?.status;

    // Handle network errors
    if (axiosError.code === 'ERR_NETWORK') {
      return {
        message: 'Unable to connect to the server. Please check if the backend is running.',
        statusCode: 0,
      };
    }

    // Handle timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout. The server is taking too long to respond.',
        statusCode,
      };
    }

    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      const errorMessage = data.message || data.error;

      if (errorMessage) {
        return {
          message: errorMessage,
          statusCode,
          details: data,
        };
      }
    }

    if (statusCode) {
      const statusMessages: Record<number, string> = {
        400: 'Invalid request. Please check your input.',
        401: 'You are not authenticated. Please log in.',
        403: 'You do not have permission to perform this action.',
        404: 'The requested resource was not found.',
        408: 'Request timeout. Please try again.',
        429: 'Too many requests. Please slow down.',
        500: 'Internal server error. Please try again later.',
        502: 'Bad gateway. The server is temporarily unavailable.',
        503: 'Service unavailable. Please try again later.',
      };

      return {
        message: statusMessages[statusCode] || `An error occurred (${statusCode}). Please try again.`,
        statusCode,
      };
    }

    // Generic Axios error
    return {
      message: axiosError.message || 'An unexpected error occurred.',
      statusCode,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred.',
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  // Handle unknown errors
  return {
    message: 'An error occurred in the open router model. Please try again.',
  };
};


export const getOperationErrorMessage = (
  operation: 'fetchModels' | 'sendMessage' | 'fetchHistory',
  error: unknown
): string => {
  const apiError = extractErrorMessage(error);

  // Add context to the error message based on the operation
  const operationContext: Record<typeof operation, string> = {
    fetchModels: 'Failed to load available AI models',
    sendMessage: 'Failed to send your message',
    fetchHistory: 'Failed to load chat history',
  };

  return `${operationContext[operation]}: ${apiError.message}`;
};

