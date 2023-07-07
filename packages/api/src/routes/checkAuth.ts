import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  const API_SECRET = process.env.API_DB_KEY;
  if (!API_SECRET) {
    throw new Error('API_SECRET is not defined');
  }

  const { body, query, header, app } = req;

  // TODO: check header type
  const token = body.token || query.token || (header as any)['x-access-token'];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }

  // TODO: check jwt.verify type
  jwt.verify(token, app.get(API_SECRET), (err: any, decoded: any) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token.',
      });
    }

    next();
  });
};
