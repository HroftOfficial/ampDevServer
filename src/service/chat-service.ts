import { chatModel } from '../models/chat.model';

class ChatService {

  async getChatOrCreateChat(firstId: string, secondId: string) {
    const chat = await chatModel.findOne({
      members: { $all:[firstId, secondId] },
    });
    if (chat) return chat;

    const newChat = new chatModel({
      members:[firstId, secondId],
    });
    const result = await newChat.save();
    return result;
  }

  async getAllChatsFromThisUser(id:string) {
    const result =  await chatModel.find({ members:{ $in:[id] } }, { _id:1 });
    const resultArray = [];
    for (const key in result) {
      if (Object.hasOwnProperty.call(result, key)) {
        const element = result[key];
        resultArray.push(element._id.toHexString());
      }
    }
    return resultArray;
  }


}
export const chatService = new ChatService();