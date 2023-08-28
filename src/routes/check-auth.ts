import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import {
  ErrorHandler,
  IErrorHandler,
  errorResponse,
  isErrorHandler,
} from '../helper'

export default (req: Request, res: Response, next: NextFunction) => {
  const JWT_NAME = process.env.JWT_NAME
  if (!JWT_NAME) {
    throw new Error('JWT_NAME is not defined')
  }

  const { app, cookies } = req

  try {
    if (!cookies.token) {
      throw new ErrorHandler({
        status: 403,
        message: 'No token provided.',
      })
    }

    const token = cookies.token

    jwt.verify(token, app.get(JWT_NAME))

    next()
  } catch (err) {
    if (isErrorHandler(err)) {
      errorResponse(res, err)
      return
    }

    errorResponse(res, {
      message: (err as Error).message,
      status: 400,
    } as IErrorHandler)
  }
}
