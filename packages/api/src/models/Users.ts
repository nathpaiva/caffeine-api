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
