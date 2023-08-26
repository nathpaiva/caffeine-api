import { Request, Response } from 'express'

export const errorResponse = (res: Response, req: Request, err: Error) => {
  const status = req.statusCode ? req.statusCode : 400
  return res.status(status).json({ message: err.message, success: false })
}
