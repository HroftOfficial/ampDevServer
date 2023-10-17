import { Request, Response, NextFunction } from 'express';
// const telegramServices = require('../service/telegram-services');
import { telegramServices } from '../service/telegram-services';

class TelegramController {

  async sendToTelegram(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req?.params;
      await telegramServices.prepareDataToTelegramChannel(id);
      res.status(200).send({ msg:'опубликовано в Телеграм' });      
    } catch (error) {
      console.error(error);
      next();
    }
  } 

}
export const telegramController = new TelegramController();
// module.exports = new telegramController();