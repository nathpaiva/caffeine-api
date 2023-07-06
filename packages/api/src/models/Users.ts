import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ErrorRequestHandler } from 'express';

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

export const comparePassword = (candidatePassword: string, hash: string, callback: any) => {
  bcrypt.compare(candidatePassword, hash, (err: any, isMatch: boolean) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
