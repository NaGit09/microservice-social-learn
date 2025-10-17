export interface apiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}
