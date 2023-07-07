import mongoose from 'mongoose';

const URL_DB = process.env.API_DB_NAME;

export default async () => {
  if (!URL_DB) {
    throw new Error('API_DB_NAME is not defined');
  }

  const db = mongoose.connection;

  db.on('error', function (err) {
    console.log('Error to connect.', err);
  });
  db.on('open', function () {
    console.log('Connection opened.');
  });
  db.on('connected', function (err) {
    mongoose.Promise = global.Promise;
    console.log('Connected to: ' + URL_DB);
  });
  db.on('disconnected', function (err) {
    console.log('Disconnected.');
  });

  mongoose.Promise = global.Promise;
  return await mongoose.connect(URL_DB);
};
