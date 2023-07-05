import { Application } from 'express';
import { Controllers } from '../controllers/types';

export default (app: Application, controllers: Controllers) => {
  app.get('/', controllers.users.root);
  app.get('/users', controllers.users.list_users);

  return app;
};
