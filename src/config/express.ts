import bodyParser from 'body-parser';
import express, { Application } from 'express';
import morgan from 'morgan';

import * as CONTROLLER from '../controllers';
import routes from '../routes';
import logger from '../services/logger';

export default () => {
  const JWT_NAME = process.env.JWT_NAME;
  const JWT_KEY = process.env.JWT_KEY;
  if (!JWT_NAME || !JWT_KEY) {
    throw new Error('JWT_NAME OR JWT_KEY is not defined');
  }

  const app: Application = express();

  app.set(JWT_NAME, JWT_KEY);

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());

  app.use(express.static('../../public'));

  app.use(
    morgan('common', {
      stream: {
        write: (msg) => {
          logger.info(msg);
        },
      },
    }),
  );

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, GET, POST, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-access-token',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  routes(app, CONTROLLER);

  return app;
};
