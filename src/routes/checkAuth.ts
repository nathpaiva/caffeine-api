import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  const JWT_NAME = process.env.JWT_NAME;
  if (!JWT_NAME) {
    throw new Error('JWT_NAME is not defined');
  }

  const { headers, app } = req;

  const reqToken = headers['x-access-token'];

  if (!reqToken) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }

  try {
    const token = typeof reqToken === 'string' ? reqToken : reqToken[0];

    jwt.verify(token, app.get(JWT_NAME));

    next();
  } catch (err) {
    return res.json({
      success: false,
      message: `Failed to authenticate token: ${err}`,
    });
  }
};
