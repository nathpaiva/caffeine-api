import express, { Application } from 'express';
import { check } from 'express-validator';

import checkAuth from './checkAuth';

export default (app: Application, controllers: Controllers) => {
  const api_routes = express.Router();
  const api_auth_routes = express.Router();

  // NOT AUTHENTICATED ROUTES
  api_routes.get('/', controllers.users.root);
  api_routes.get('/users', controllers.users.list_users);
  api_routes.post(
    '/create/user',
    [
      check('name', 'Name is required').isLength({ min: 3 }),
      check('email', 'Email is required').isEmail(),
      check(
        'password',
        'Password must be at least 2 characters long and contain one number, one lowercase letter, and one uppercase letter',
      )
        // TODO: change min to 8
        .isLength({ min: 2 })
        // TODO: add contains to restring the password
        .notEmpty(),
    ],
    controllers.users.create_user,
  );
  api_routes.post('/login', controllers.users.login);

  // AUTHENTICATED ROUTES
  api_auth_routes.get('/users', checkAuth, controllers.users.list_users);

  app.use('/auth', api_auth_routes);
  app.use('/api', api_routes);
};
