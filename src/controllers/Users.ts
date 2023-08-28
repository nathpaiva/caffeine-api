import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { errorResponse } from '../helper'
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
    if (response && !response.isEmpty()) {
      return res.status(422).json({ errors: response.array() })
    }
    try {
      const hasUser = await Users.find({
        $or: [{ user_name: user.name }, { email: user.email }],
      })
      if (hasUser.length > 0) {
        throw new Error('User already exists')
      }
      const insertNewUserReference = new Users(user)
      const resultNewUser = await createUser(insertNewUserReference)
      if (!resultNewUser) {
        throw new Error("User couldn't be created")
      }
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
      })
    } catch (err) {
      errorResponse(res, req, err as Error)
    }
  },
  login: async (req, res) => {
    try {
      const user = await Users.findOne({
        name: req.body.name,
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Authentication failed. User not found.',
        })
      }

      const isMatch = await comparePassword(req.body.password, user.password)

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed. Wrong password.',
        })
      }

      const JWT_NAME = process.env.JWT_NAME
      if (!JWT_NAME) {
        throw new Error('JWT_NAME is not defined')
      }

      const token = _generateToken(user.toJSON(), req.app.get(JWT_NAME))

      res.cookie('name', user.name)
      res.cookie('token', token)
      res.cookie('userId', user.id)

      return res.json({
        success: true,
        id: user.id,
        name: user.name,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Authentication failed. Internal server error. ${error}`,
      })
    }
  },
  delete: async (req, res) => {
    // TODO: WIP
    // const user: User = req.body
    console.log('🚀 ~ file: Users.ts:89 ~ delete: ~ user:', req.params.id)
    try {
      if (!req.params.id) {
        throw new Error('the id should be provided')
      }
      const response = await Users.findOneAndDelete({ _id: req.params.id })
      console.log('🚀 ~ file: Users.ts:98 ~ delete: ~ response:', response)

      res.json({
        success: true,
      })
    } catch (err) {
      errorResponse(res, req, err as Error)
    }
  },
}
