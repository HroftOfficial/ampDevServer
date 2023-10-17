import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId, ref: 'users',
  },
  refreshToken:{
    type: String,
    required: true,
  },
});

const tokenModel = model('tokens', TokenSchema);
export { tokenModel };
// module.exports = model('tokens', TokenSchema);