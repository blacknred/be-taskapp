import type { ID } from './base.interface';

export interface IValidationError {
  field: string;
  message: string;
}

export interface IPaginatedData<T> {
  hasMore: boolean;
  total?: number;
  items: T[];
}

export interface IResponse<T = unknown> {
  message?: string;
  errors?: IValidationError[];
  data?: T;
}

export type IEmptyResponse = IResponse<null>;

export type IIdResponse = IResponse<ID>;

export type IPaginatedResponse<T> = IResponse<IPaginatedData<T>>;
