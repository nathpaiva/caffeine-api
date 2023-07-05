import { Request, Response } from 'express';

export type UsersController = {
  root: (req: Request, res: Response) => void;
  list_users: (req: Request, res: Response) => void;
};

export type Controllers = {
  users: UsersController;
};
