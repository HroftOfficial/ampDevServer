import { Request, Response, NextFunction } from 'express';

import { chatModel } from '../models/chat.model';
import { userModelAmp } from '../models/userAmp.model';

//create chat
export const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
//findUserChats
export const userChats = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  // console.log(userId)
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    // console.log(chats)

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//findChat
export const findChat = async (req: Request, res: Response, next: NextFunction) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//findAllChats
export const allChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chats = await chatModel.find().sort({ createdAt:-1 });
    const resultArray = [];
    for (const key in chats) {
      if (Object.hasOwnProperty.call(chats, key)) {
        const element = chats[key];
        const nameMembers0 = await userModelAmp.findOne({ _id:element?.members[0] }, { org:1, _id:0 });
        const nameMembers1 = await userModelAmp.findOne({ _id:element?.members[1] }, { org:1, _id:0 });
        if (!!nameMembers0 && nameMembers1) {          
          resultArray.push({
            _id: element._id.toString(),
            members: element.members,
            members_name:[nameMembers0.org, nameMembers1.org],
            members_name_title:nameMembers0.org + ' < == > ' + nameMembers1.org,
            createdAt: element.createdAt,
          });
        }
      }
    }
    res.status(200).json(resultArray);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// module.exports = { createChat, userChats, findChat, allChats };
