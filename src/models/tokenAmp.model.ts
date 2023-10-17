import { Schema, model } from 'mongoose';

const TokenAmpSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId, ref: 'usersamps',
  },
  refreshToken:{
    type: String,
    required: true,
  },
});

module.exports = model('tokensAmps', TokenAmpSchema);