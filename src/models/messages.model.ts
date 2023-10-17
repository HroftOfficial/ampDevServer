import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
  {
    chatId:{
      type: String,
    },
    senderId:{
      type:String,
    },
    title:{
      type:String,
    },
    text:{
      type:String,
    },
    urlFile:{
      type:String,
    },
    realNameFile:{
      type: String,
    },
  },
  { timestamps: true },

);

export const messageModel = model('messages', MessageSchema);
// module.exports = model("messages", MessageSchema)