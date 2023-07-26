type UsersController = {
  root: (req: Request, res: Response) => void;
  list_users: (req: Request, res: Response) => void;
  login: (req: Request, res: Response) => void;
  create_user: (req: Request, res: Response) => void;
};

type Controllers = {
  users: UsersController;
};