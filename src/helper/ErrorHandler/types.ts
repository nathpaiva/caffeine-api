export interface IErrorHandler {
  message: string
  status: number
}

export function isErrorHandler<T>(
  data: T | IErrorHandler,
): data is IErrorHandler {
  return !(data as IErrorHandler).status !== undefined
}
