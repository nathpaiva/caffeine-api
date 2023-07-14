import bcrypt from 'bcryptjs';
import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
  user_name: {
    type: String,
    default: '',
  },
  user_mail: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  create_date: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('Users', usersSchema);

// TODO: refactor this function and check the type
export const comparePassword = (
  candidatePassword: string,
  hash: string,
  callback: any,
) => {
  // TODO: check bcrypt.compare type
  bcrypt.compare(candidatePassword, hash, (err: any, isMatch: boolean) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
