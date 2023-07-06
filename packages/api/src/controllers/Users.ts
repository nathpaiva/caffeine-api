import { ErrorRequestHandler, Request, Response } from 'express';
import Users, { comparePassword } from '../models/Users';
import { Controllers } from './types';

export const users: Controllers['users'] = {
  root: (_: Request, res: Response) => res.json({ message: 'Welcome to the coolest API on earth!' }),
  list_users: async (_: Request, res: Response) => {
    const users = await Users.find();

    res.json(users);
  },
  login: async (req: Request, res: Response) => {
    try {
      console.log('req.body', req);

      const users = await Users.findOne({ user_name: req.body.user_name });

      console.log('users', users);

      if (!users) {
        return res.status(404).json({
          success: false,
          message: 'Authentication failed. User not found.',
        });
      }

      comparePassword(users.user_name, users.password, (_: Request, isMatch: boolean) => {
        console.log('isMatch', isMatch);
      });

      return res.json({ users });
    } catch (error) {
      // TODO: create the error handler
      throw error;
    }
  },
};
