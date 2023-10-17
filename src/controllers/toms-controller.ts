import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';
import { tomsService } from '../service/toms-service';

class TomsController {

  async getToms(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации(группа предприятий)'));
      }
      const toms = await tomsService.getToms();
      return res.json(toms);
    } catch (error) {
      next(error);
    }
  }

  async deleteToms(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации(удаление типа мех. обработки)'));
      }
      const { id } = req.params;
      const { enabled, deleted } = req.body;
      const tomsDelete = await tomsService.deleteToms(id, enabled, deleted);
      return res.json(tomsDelete);
    } catch (error) {
      next(error);
    }
  }

  async createToms(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      const { name, group, enabled } = req.body;
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации(создание вида обработки)'));
      }
      const tomsData = await tomsService.createToms(name, group, enabled);
      return res.json(tomsData);
    } catch (error) {
      next(error);
    }
  }

  async getTomsDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации детализация вид обработки'));
      }
      const { id } = req.params;
      const tomsData = await tomsService.getTomsFromId(id);
      if (!tomsData) {
        return next(ApiError.NotFound());
      }
      return res.json(tomsData);
    } catch (error) {
      next(error);
    }
  }

  async updateTomsItems(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации ID вид обработки'));
      }
      const { id } = req.params;
      const { name, group, enabled } = req.body;
            
      const data = await tomsService.getTomsFromId(id);
      if (!!data) {

        data.name = name;
        data.tomsgroup_key = group;
        data.enabled = enabled;
        data.save();
        return res.json(data);
      }
      return null;
    } catch (error) {
      next(error);
    }
  }

}
export const tomsController = new TomsController();
// module.exports = new TomsGroupController();