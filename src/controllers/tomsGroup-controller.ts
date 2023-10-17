import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';
import { tomsGroupService } from '../service/tomsGroup-service';

class TomsGroupController {
  async getTomskGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации(группа предприятий)'),
        );
      }
      const tomsGroup = await tomsGroupService.getTomsGroup();
      return res.json(tomsGroup);
    } catch (error) {
      next(error);
    }
  }

  async getTomsGroupDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации'));
      }
      const { id } = req.params;
      const tomsGroupItem = await tomsGroupService.getTomsGroupFromId(id);
      if (!tomsGroupItem) {
        return next(ApiError.NotFound());
      }
      return res.json(tomsGroupItem);
    } catch (error) {
      next(error);
    }
  }

  async updateTomsGroupItems(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации1'));
      }
      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { name_rus, name_eng } = req.body;
      const data = await tomsGroupService.getTomsGroupFromId(id);
      if (!!data) {
        data.name_rus = name_rus;
        data.name_eng = name_eng;
        data.save();
        return res.json(data);
      }
      return null;
    } catch (error) {
      next(error);
    }
  }

  async createTomsGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { name_rus, name_eng } = req.body;
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации'));
      }
      const tomsGroupData = await tomsGroupService.createTomsGroup(
        name_rus,
        name_eng,
      );
      return res.json(tomsGroupData);
    } catch (error) {
      next(error);
    }
  }

  async deleteToms(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации(удаление группы обработки)'),
        );
      }
      const { id } = req.params;
      const { enabled, deleted } = req.body;
      const tomsDelete = await tomsGroupService.deleteToms(
        id,
        enabled,
        deleted,
      );
      return res.json(tomsDelete);
    } catch (error) {
      next(error);
    }
  }
}

export const tomsGroupController = new TomsGroupController();
// module.exports = new TomsGroupController();
