export interface IErrorHandler {
  message: string
  status: number
}

export function isErrorHandler<T>(
  data: T | IErrorHandler,
): data is IErrorHandler {
  return typeof !(data as IErrorHandler).status === 'number'
}
