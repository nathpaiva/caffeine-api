import express, { Application } from 'express';
import { Controllers } from '../controllers/types';
import checkAuth from './checkAuth';

export default (app: Application, controllers: Controllers) => {
  const api_routes = express.Router();
  const api_auth_routes = express.Router();

  // NOT AUTHENTICATED ROUTES
  api_routes.get('/', controllers.users.root);
  api_routes.get('/users', controllers.users.list_users);
  api_routes.post('/login', controllers.users.login);

  // AUTHENTICATED ROUTES
  api_auth_routes.get('/users', checkAuth, controllers.users.list_users);

  app.use('/auth', api_auth_routes);
  app.use('/api', api_routes);
};
