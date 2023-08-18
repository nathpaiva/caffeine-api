import mongoose from 'mongoose'

const capsulesInterfaceSchema = new mongoose.Schema<Capsule>({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  type: {
    type: String,
  },
  price_last_buy: {
    type: Number,
  },
  quantity_by_week: {
    type: Number,
  },
  notify_end: {
    active: {
      type: Boolean,
      default: false,
    },
    days_before: {
      type: Number,
    },
  },
  create_date: {
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model('Capsules', capsulesInterfaceSchema)
