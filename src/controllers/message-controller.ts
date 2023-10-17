import { Request, Response, NextFunction } from 'express';
import { messageModel } from '../models/messages.model';
import { chatService } from '../service/chat-service';
import { mailService } from '../service/mail-service';
import { userServiceAmp as userAmpService } from '../service/userAmp-service';

//create Message
export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  const {
    chatId,
    senderId,
    text,
    title = '',
    urlFile = '',
    realNameFile = '',
  } = req.body;
  // console.log("create messages >> ", req.body);
  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
      title,
      urlFile,
      realNameFile,
    });
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//geMessages
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  const { chatId } = req.params;
  // console.log("messages ID", req.params.chatId, chatId)
  try {
    // const messages = await messageModel.find({ chatId });
    const messages = await messageModel.aggregate([
      { $match: { chatId: chatId } },
      { $addFields: { isenderId: { $toObjectId: '$senderId' } } },
      {
        $lookup: {
          from: 'usersamps',
          localField: 'isenderId',
          foreignField: '_id',
          as: 'senderName',
        },
      },
      {
        $project: {
          senderNamePretty: { $arrayElemAt: ['$senderName.org', 0] },
          chatId: 1,
          createdAt: 1,
          senderId: 1,
          text: 1,
          title: 1,
        },
      },
    ]);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
//
export const firstMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      senderId = '',
      title = '',
      text = '',
      receiverId = '',
      urlFile = '',
      realNameFile = '',
    } = req.body;
    if (!senderId || !receiverId) {
      return null;
    }
    // ищем писал ли пользователь ранее в чат этому респондету. Если да - добавляем в существующий чат
    // Если нет, то создаем новый
    const chat = await chatService.getChatOrCreateChat(senderId, receiverId);
    const chatId = chat?._id.toString();
    // console.log("first mesage", senderId, title, text, chatId);

    const info = await userAmpService.getUserFromId(receiverId);
    // console.log(user_id, info.name);
    // const username = info?.name;
    // const org = info?.org;
    const email = info?.email;
    // const email = 'sagdinov.a@yandex.ru';
    const msg = text;
    const mailTheme = `Для вас новое сообщение с темой ${title}`;
    // console.log('first message >>', username, org, email, msg,  mailTheme)
    if (!email || !msg) { return null;}

    const newFirstMessages = new messageModel({
      senderId,
      title,
      text,
      chatId,
      urlFile,
      realNameFile,
    });

    const result = await newFirstMessages.save();
    // await mailService.sendZvkChat(username, org, email, msg, mailTheme);
    await mailService.sendZvkChat( email, msg, mailTheme);
    res.status(200).json(result);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

export const getInitMessages = async (req: Request, res: Response, next: NextFunction) => {
  // console.log("route get init messages")
  try {
    const id = req.user?._id;
    if (!id) {return null;}
    /**get last visit user */
    const lastVisit = await userAmpService.getUserFromId(id);
    if (!lastVisit) {return null;}
    /**get chat from user ID */
    const chatArray = await chatService.getAllChatsFromThisUser(id);
    /**get messages where chatId in chatArray and lastVisit User < createdAt messages */
    const countMessages = await messageModel.find({ chatId:{ $in:chatArray }, 
      createdAt:{ $gt:lastVisit?.lastVisit },
    });
    // console.log(
    //   // lastVisit.lastVisit,
    //   // chatArray, 
    //   // countMessages.length
    // );
    // res.status(200).json(countMessages.length);
    res.status(200).json(countMessages);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
    next(error);
  }

};

// module.exports = { createMessage, getMessages, firstMessages, getInitMessages };
