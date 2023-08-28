import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { ErrorHandler, errorResponse, isErrorHandler } from '../helper'
import Users, { comparePassword, createUser } from '../models/Users'

const _generateToken = (user: User, secret: string) => {
  return jwt.sign(user, secret, { expiresIn: '1h' })
}

export const users: Controllers['users'] = {
  list_users: async (req, res) => {
    const users = await Users.find()

    res.json(users)
  },
  create_user: async (req, res) => {
    const user = req.body
    const response = validationResult(req)

    try {
      if (response && !response.isEmpty()) {
        throw new ErrorHandler({
          status: 422,
          message: response.array().reduce((acc, message) => {
            return acc.concat(message.msg)
          }, ''),
        })
      }

      const hasUser = await Users.find({
        $or: [{ user_name: user.name }, { email: user.email }],
      })

      if (hasUser.length > 0) {
        throw new ErrorHandler({
          message: 'User already exists',
          status: 400,
        })
      }

      const insertNewUserReference = new Users(user)
      const resultNewUser = await createUser(insertNewUserReference)
      if (!resultNewUser) {
        throw new ErrorHandler({
          message: "User couldn't be created",
          status: 400,
        })
      }

      res.status(201).json({
        success: true,
        message: 'User created successfully',
      })
    } catch (err) {
      if (isErrorHandler(err)) {
        errorResponse(res, err)
        return
      }
      errorResponse(res, {
        message: (err as Error).message,
        status: 400,
      } as ErrorHandler)
    }
  },
  login: async (req, res) => {
    try {
      const user = await Users.findOne({
        name: req.body.name,
      })

      if (!user) {
        throw new ErrorHandler({
          status: 404,
          message: 'Authentication failed. User not found.',
        })
      }

      const isMatch = await comparePassword(req.body.password, user.password)

      if (!isMatch) {
        throw new ErrorHandler({
          status: 401,
          message: 'Authentication failed. Wrong password.',
        })
      }

      const JWT_NAME = process.env.JWT_NAME
      if (!JWT_NAME) {
        throw new ErrorHandler({
          status: 500,
          message: 'JWT_NAME is not defined',
        })
      }

      const token = _generateToken(user.toJSON(), req.app.get(JWT_NAME))

      res.cookie('name', user.name)
      res.cookie('token', token)
      res.cookie('userId', user.id)

      return res.json({
        success: true,
      })
    } catch (err) {
      if (isErrorHandler(err)) {
        errorResponse(res, err)
        return
      }
      errorResponse(res, {
        message: (err as Error).message,
        status: 400,
      } as ErrorHandler)
    }
  },
  delete: async (req, res) => {
    try {
      if (!req.cookies.userId) {
        throw new ErrorHandler({
          message: 'The user id must be provided',
          status: 400,
        })
      }
      await Users.findOneAndDelete({ _id: req.cookies.userId })
      // TODO: Clean up user entry
      // const capsules = await Capsules.find({ user_id: req.cookies.userId })

      res.json({
        success: true,
      })
    } catch (err) {
      if (isErrorHandler(err)) {
        errorResponse(res, err)
        return
      }
      errorResponse(res, {
        message: (err as Error).message,
        status: 400,
      } as ErrorHandler)
    }
  },
}
