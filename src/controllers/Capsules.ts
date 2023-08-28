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
  async delete(req, res) {
    const { id } = req.params

    try {
      await Capsules.findByIdAndRemove(id)

      return res.json({
        success: true,
      })
    } catch (err) {
      return res.json({
        success: false,
        message: err,
      })
    }
  },
}
