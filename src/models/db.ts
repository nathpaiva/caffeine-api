import mongoose from 'mongoose'

const URL_DB = process.env.API_DB_URL

export default async () => {
  if (!URL_DB) {
    throw new Error('API_DB_URL is not defined')
  }

  const db = mongoose.connection

  db.on('error', function (err) {
    console.log(`Error to connect. ${err}`)
  })
  db.on('open', function () {
    console.log('Connection opened.')
  })
  db.on('connected', function () {
    console.log(`Connected to: ${URL_DB}`)
  })
  db.on('disconnected', function () {
    console.log('Disconnected.')
  })

  return await mongoose.connect(URL_DB)
}
