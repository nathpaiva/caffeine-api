interface Capsule {
  readonly user_id: string
  name: string
  brand: string
  type: string
  price_last_buy: number
  quantity_by_week: number
  notify_end: {
    active: boolean
    days_before: number
  }
  create_date?: Date
}
