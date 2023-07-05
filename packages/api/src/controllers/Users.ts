import { Request, Response } from 'express';
import Users from '../models/Users';
import { Controllers } from './types';

export const users: Controllers['users'] = {
  root: (_: Request, res: Response) => res.json({ message: 'Welcome to the coolest API on earth!' }),
  list_users: async (_: Request, res: Response) => {
    const users = await Users.find();

    res.json(users);
  },
};
