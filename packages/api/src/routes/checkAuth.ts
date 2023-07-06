import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  const { body, query, header, app } = req;

  // TODO: check header type
  const token = body.token || query.token || (header as any)['x-access-token'];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }

  jwt.verify(token, app.get('superSecret'), (err: any, decoded: any) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token.',
      });
    }

    next();
  });
};
