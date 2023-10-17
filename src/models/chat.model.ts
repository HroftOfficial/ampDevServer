import { Schema, model } from 'mongoose';

const ChatSchema = new Schema(
  {
    members:{
      type:Array,
    },
  },
  { timestamps: true },
);
export const chatModel = model('chats', ChatSchema);
// module.exports = model("chats", ChatSchema)
