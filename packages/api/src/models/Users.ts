import bcrypt from 'bcryptjs';
import mongoose, { Document, HydratedDocument } from 'mongoose';

const userInterfaceSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    default: '',
  },
  email: {
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

export default mongoose.model('Users', userInterfaceSchema);

export const comparePassword = async (
  candidatePassword: string,
  hash: string,
): Promise<boolean> => {
  try {
    const isPassMatch = await bcrypt.compare(candidatePassword, hash);

    return isPassMatch;
  } catch (err) {
    throw new Error('error comparing password');
  }
};

export const createUser = async (
  newUser: HydratedDocument<User>,
): Promise<User> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);

    const result = await newUser.save();
    newUser.password = hash;

    return result;
  } catch (err) {
    throw new Error('Error creating user');
  }
};
