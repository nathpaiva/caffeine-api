import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { Application } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import * as CONTROLLERS from '../controllers'
import routes from '../routes'
import { logger } from '../services'

export default () => {
  const { JWT_NAME, JWT_KEY } = process.env
  if (!JWT_NAME || !JWT_KEY) {
    throw new Error('JWT_NAME OR JWT_KEY is not defined')
  }

  const app: Application = express()

  app.set(JWT_NAME, JWT_KEY)

  app.use(helmet())
  app.use(cookieParser())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )
  app.use(bodyParser.json())

  app.use(
    morgan('common', {
      stream: {
        write: (msg) => {
          logger.info(msg)
        },
      },
    }),
  )

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, GET, POST, DELETE, OPTIONS',
    )
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-access-token',
    )
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  })

  routes(app, CONTROLLERS)

  return app
}
