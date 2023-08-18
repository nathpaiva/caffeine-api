import { validationResult } from 'express-validator'

import Capsules from '../models/Capsules'

type CapsuleBody = Omit<Capsule, 'create_date' | 'notify_end'> & {
  notify_end_days_before?: Capsule['notify_end']['days_before']
  notify_end_active?: Capsule['notify_end']['active']
}

export const capsules: Controllers['capsules'] = {
  async list_capsules(req, res) {
    const capsules = await Capsules.find()

    return res.json({
      success: true,
      items: capsules,
    })
  },
  async create(req, res) {
    const { id } = req.params
    const response = validationResult(req)

    if (response && !response.isEmpty()) {
      return res.status(422).json({ errors: response.array() })
    }

    const capsules: CapsuleBody = req.body

    try {
      const response = await Capsules.create<Omit<Capsule, 'create_date'>>({
        user_id: id,
        name: capsules.name,
        brand: capsules.brand,
        type: capsules.type,
        price_last_buy: capsules.price_last_buy,
        quantity_by_week: capsules.quantity_by_week,
        notify_end: {
          active: capsules.notify_end_active ?? false,
          days_before: capsules.notify_end_days_before ?? 0,
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
