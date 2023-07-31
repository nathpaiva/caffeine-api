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
        .isLength({ min: 2 })
        // TODO: add contains to restring the password
        .notEmpty(),
    ],
    controllers.users.create_user,
  );
  api_routes.post('/login', controllers.users.login);

  // AUTHENTICATED ROUTES
  api_auth_routes.get('/users', checkAuth, controllers.users.list_users);
  api_auth_routes.get(
    '/capsules',
    checkAuth,
    controllers.capsules.list_capsules,
  );
  api_auth_routes.delete(
    '/capsules/:id',
    checkAuth,
    controllers.capsules.delete,
  );
  api_auth_routes.post(
    '/capsules/user/:id',
    checkAuth,
    [
      check('name', 'Name is required').isLength({ min: 3 }),
      check('brand', 'Brand is required').isLength({ min: 3 }),
      check('type', 'Type is required').isLength({ min: 3 }),
      check('price_last_buy', 'Price is required').isNumeric(),
      check('quantity_by_week', 'Quantity is required').isNumeric(),
      check('notify_end_days_before', 'Notify is required').isNumeric(),
      check('notify_end_active', 'Notify is required').isBoolean(),
    ],
    controllers.capsules.create,
  );

  app.use('/api/auth', api_auth_routes);
  app.use('/api', api_routes);
};
