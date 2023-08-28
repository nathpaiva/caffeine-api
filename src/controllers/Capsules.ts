import { validationResult } from 'express-validator'

import { ErrorHandler, errorResponse, isErrorHandler } from '../helper'
import Capsules from '../models/Capsules'

export const capsules: Controllers['capsules'] = {
  async create(req, res) {
    const { userId } = req.cookies
    const responseValidation = validationResult(req)

    try {
      if (responseValidation && !responseValidation.isEmpty()) {
        throw new ErrorHandler({
          status: 422,
          message: responseValidation.array().reduce((acc, message) => {
            return acc.concat(message.msg)
          }, ''),
        })
      }

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
  async get_capsule(req, res) {
    const { id } = req.params
    const { userId } = req.cookies

    try {
      if (!userId) {
        throw new ErrorHandler({ status: 400, message: 'You must to login' })
      }

      if (!id) {
        throw new ErrorHandler({
          status: 400,
          message: 'You must provide the capsule id',
        })
      }

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
  async delete(req, res) {
    const { id } = req.params
    const { userId } = req.cookies

    try {
      if (!userId) {
        throw new ErrorHandler({ status: 400, message: 'You must to login' })
      }

      if (!id) {
        throw new ErrorHandler({
          status: 400,
          message: 'You must provide the capsule id to delete',
        })
      }
      const result = await Capsules.findOneAndDelete({
        user_id: userId,
        _id: id,
      })

      if (!result) {
        throw new ErrorHandler({ status: 400, message: 'Not found' })
      }

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
}
