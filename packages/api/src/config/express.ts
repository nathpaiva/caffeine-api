import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import routes from '../routes';
import morgan from 'morgan';
import logger from '../services/logger';

import jwt from 'jsonwebtoken';
import config from '../models/config';

import * as CONTROLLER from '../controllers';

export default () => {
  const app: Application = express();

  app.set('superSecret', config().secret);

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(express.static('../../public'));

  app.use(
    morgan('common', {
      stream: {
        write: (msg) => {
          logger.info(msg);
        },
      },
    })
  );

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-access-token'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  routes(app, CONTROLLER);

  return app;
};
