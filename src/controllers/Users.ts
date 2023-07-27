import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import Users, { comparePassword, createUser } from '../models/Users';

const _generateToken = (user: User, secret: string) => {
  return jwt.sign(user, secret, { expiresIn: '1h' });
};

export const users: Controllers['users'] = {
  root: (_: Request, res: Response) =>
    res.json({ message: 'Welcome to the coolest API on earth!' }),
  list_users: async (_: Request, res: Response) => {
    const users = await Users.find();

    res.json(users);
  },
  create_user: async (req: Request, res: Response) => {
    const user: User = req.body;

    const response = validationResult(req);

    if (response && !response.isEmpty()) {
      return res.status(422).json({ errors: response.array() });
    }

    try {
      const hasUser = await Users.find({
        $or: [{ user_name: user.name }, { email: user.email }],
      });

      if (hasUser.length > 0) {
        throw new Error('User already exists');
      }

      const insertNewUserReference = new Users(user);
      const resultNewUser = await createUser(insertNewUserReference);

      if (!resultNewUser) {
        throw new Error("User couldn't be created");
      }

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
      });
    } catch (err) {
      return res
        .status(400)
        .json({ message: (err as Error).message, success: false });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const user = await Users.findOne({ user_name: req.body.user_name });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Authentication failed. User not found.',
        });
      }

      const isMatch = await comparePassword(req.body.password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed. Wrong password.',
        });
      }

      // TODO: env use
      const API_SECRET = process.env.API_DB_KEY;
      if (!API_SECRET) {
        throw new Error('API_SECRET is not defined');
      }

      const token = _generateToken(user.toJSON(), req.app.get(API_SECRET));

      // TODO: refactor this return
      return res.json({
        success: true,
        message: 'Enjoy your token!',
        token,
        users: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Authentication failed. Internal server error. ${error}`,
      });
    }
  },
};
