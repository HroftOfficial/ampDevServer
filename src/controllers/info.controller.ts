import { Request, Response, NextFunction } from 'express';
const infoService = require('../service/info-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exertions/api-error');
const config = require('../config/config');

class InfoController {
  async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array()),
        );
      }
      const result = await infoService.getInfo();
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async sendZvkForm(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации форма заявки на регистрацию',
            errors.array(),
          ),
        );
      }
      const { username, org, email, tel, msg, mailTheme } = req.body;
      const result = infoService.sendZvk(
        username,
        org,
        email,
        tel,
        msg,
        mailTheme,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getInfoData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array()),
        );
      }
      const result = await infoService.getFindInfo();
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getZakazesInfoData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации', errors.array()),
        );
      }
      const { page = '1', limit = config?.DRAFT_LIMIT } = req?.params;
      const offset = limit * parseInt(page) - limit;
      const { data } = req?.body;

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req.user?._id;
      const searchData = await infoService.getZakazesInfoData(
        offset,
        parseInt(limit),
        data,
        user_id,
      );
      res.set('x-total', searchData?.count);
      const dataFind = searchData?.dataFind;
      return res.json(dataFind);
    } catch (error) {
      next(error);
    }
  }
}
export const infoController = new InfoController();
// module.exports = new InfoController();
