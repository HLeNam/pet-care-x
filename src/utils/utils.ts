import axios, { AxiosError, HttpStatusCode } from 'axios';
import type { ResponseApi } from '~/types/utils.type';

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function isAxiosUnauthorizedError<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isExpiredTokenError<T>(error: unknown): error is AxiosError<T> {
  return (
    isAxiosUnauthorizedError<
      ResponseApi<{
        message?: string;
        name?: string;
      }>
    >(error) && error.response?.data.data?.name === 'EXPIRED_TOKEN'
  );
}
