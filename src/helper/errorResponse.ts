import { Response } from 'express'

import { IErrorHandler } from './ErrorHandler'

export const errorResponse = (
  res: Response,
  { status, message }: IErrorHandler,
) => {
  return res.status(status).json({ message, success: false })
}
