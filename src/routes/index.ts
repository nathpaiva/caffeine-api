import express, { Application } from 'express'
import { check } from 'express-validator'

import checkAuth from './check-auth'

export default (app: Application, controllers: Controllers) => {
  /**
   * routes config
   */
  const api_routes = express.Router()
  const api_auth_routes = express.Router()

  // NOT AUTHENTICATED ROUTES
  /**
   * Get all users, this endpoint was created only for the test propose
   */
  api_routes.get('/users', controllers.users.list_users)
  /**
   * Create a new user
   */
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
  )
  /**
   * User login to get the token
   */
  api_routes.post('/login', controllers.users.login)

  // AUTHENTICATED ROUTES
  /**
   * Delete user
   */
  api_auth_routes.delete('/users', checkAuth, controllers.users.delete)
  /**
   * Get all users, this endpoint was created only for the test propose
   */
  api_auth_routes.get('/users', checkAuth, controllers.users.list_users)
  /**
   * Create the capsule to the current authenticated user
   */
  api_auth_routes.post(
    '/capsules',
    checkAuth,
    [
      check('name', 'Name is required').isLength({ min: 3 }),
      check('brand', 'Brand is required').isLength({ min: 3 }),
      check('type', 'Type is required').isLength({ min: 3 }),
      check('price_last_buy', 'Price is required').isNumeric(),
      check('quantity_by_week', 'Quantity is required').isNumeric(),
      check('notify_end.days_before', 'Notify is required').isNumeric(),
      check('notify_end.active', 'Notify is required').isBoolean(),
    ],
    controllers.capsules.create,
  )
  api_auth_routes.get(
    '/capsules/:id',
    checkAuth,
    controllers.capsules.get_capsule,
  )
  /**
   * Get all capsules this endpoint was created only for the test propose
   */
  api_auth_routes.get(
    '/capsules',
    checkAuth,
    controllers.capsules.list_capsules,
  )
  /**
   * Delete a capsule
   */
  api_auth_routes.delete(
    '/capsules/:id',
    checkAuth,
    controllers.capsules.delete,
  )

  app.use('/api/auth', api_auth_routes)
  app.use('/api', api_routes)
}
