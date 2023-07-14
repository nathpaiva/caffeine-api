import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import Users, { comparePassword } from '../models/Users';
import { Controllers } from './types';

// TODO: refactor this function and check the type
const _generateToken = (user: any, secret: any) => {
  return jwt.sign(user.toJSON(), secret, { expiresIn: '1h' });
};

export const users: Controllers['users'] = {
  root: (_: Request, res: Response) =>
    res.json({ message: 'Welcome to the coolest API on earth!' }),
  list_users: async (_: Request, res: Response) => {
    const users = await Users.find();

    res.json(users);
  },
  login: async (req: Request, res: Response) => {
    try {
      const users = await Users.findOne({ user_name: req.body.user_name });

      if (!users) {
        return res.status(404).json({
          success: false,
          message: 'Authentication failed. User not found.',
        });
      }

      // TODO: refactor this function
      comparePassword(
        req.body.password,
        users.password,
        (_: Request, isMatch: boolean) => {
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: 'Authentication failed. Wrong password.',
            });
          }

          const token = _generateToken(users, req.app.get('superSecret'));

          // TODO: refactor this return
          return res.json({
            success: true,
            message: 'Enjoy your token!',
            token,
            users,
          });
        },
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Authentication failed. Internal server error. ${error}`,
      });
    }
  },
};
