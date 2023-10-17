import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name:{
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase:true,
  },
  password:{
    type: String,
    required: true,
  },
  enabled:{
    type: Boolean,
    required: true,
    default: false,
  },
  position:{
    type:String,
    required: true,
    default:'менеджер АМП',
  },
});

const userModel = model('users', UserSchema);
export { userModel };
// module.exports = model('users', UserSchema);
