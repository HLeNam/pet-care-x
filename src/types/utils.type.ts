export interface ResponseApi<Data> {
  message: string;
  data?: Data;
}

export interface ErrorResponseApi<Data> {
  message: string;
  data?: Data;
}

export interface SuccessResponseApi<Data> {
  message: string;
  data: Data;
}

/**
 * Cú pháp loại bỏ các trường có giá trị undefined trong một đối tượng.
 */
export type NoUndefinedFields<T> = {
  [K in keyof T]-?: NoUndefinedFields<NonNullable<T[K]>>;
};
