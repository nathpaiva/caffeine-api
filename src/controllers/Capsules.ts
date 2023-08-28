import { validationResult } from 'express-validator'

import { ErrorHandler, isErrorHandler } from '../helper'
import Capsules from '../models/Capsules'

export const capsules: Controllers['capsules'] = {
  async create(req, res) {
    const { userId } = req.cookies
    const response = validationResult(req)

    if (response && !response.isEmpty()) {
      return res.status(422).json({ errors: response.array() })
    }

    try {
      const {
        name,
        brand,
        type,
        price_last_buy,
        quantity_by_week,
        notify_end: { active, days_before },
      } = req.body

      const response = await Capsules.create<Capsule>({
        user_id: userId,
        name: name,
        brand: brand,
        type: type,
        price_last_buy: price_last_buy,
        quantity_by_week: quantity_by_week,
        notify_end: {
          active: active ?? false,
          days_before: days_before ?? 0,
        },
      })

      return res.json({
        success: true,
        data: response,
      })
    } catch (err) {
      return res.json({
        success: false,
        message: err,
      })
    }
  },
  async list_capsules(req, res) {
    try {
      const { userId } = req.cookies
      const capsules = await Capsules.find({
        user_id: userId,
      })

      return res.json({
        success: true,
        items: capsules,
      })
    } catch (error) {
      res.json({
        success: false,
        message: error,
      })
    }
  },
  async get_capsule(req, res) {
    const { id } = req.params
    const { userId } = req.cookies
    if (!userId) {
      throw new Error('You must to login')
    }

    if (!id) {
      throw new Error('You must provide the capsule id')
    }

    try {
      const capsule = await Capsules.findOne({
        user_id: userId,
        _id: id,
      })

      if (!capsule) {
        throw new ErrorHandler({
          message: 'Capsule not found',
          status: 400,
        })
      }

      res.json({
        success: true,
        capsule,
      })
    } catch (error) {
      if (isErrorHandler(error)) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        })
      }
    }
  },
  async delete(req, res) {
    const { id } = req.params
    const { userId } = req.cookies

    if (!userId) {
      throw new Error('You must to login')
    }

    if (!id) {
      throw new Error('You must provide the capsule id to delete')
    }

    try {
      const result = await Capsules.findOneAndDelete({
        user_id: userId,
        _id: id,
      })

      if (!result) {
        throw new Error('Not found')
      }

      return res.json({
        success: true,
      })
    } catch (err) {
      return res.json({
        success: false,
        message: (err as Error).message,
      })
    }
  },
}
