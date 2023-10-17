import { Request, Response, NextFunction } from 'express';
import { workGroupService } from '../service/workGroup-service';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';

class WorkGroupController {
  async getWorkGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(группа предприятий)',
          ),
        );
      }
      const workGroup = await workGroupService.getWorkGroup();
      return res.json(workGroup);
    } catch (error) {
      next(error);
    }
  }

  async createWorkGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      const { name, raiting, legend } = req.body;
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }
      const workGroupData = await workGroupService.createWorkGroup(
        name,
        raiting,
        legend,
      );
      return res.json(workGroupData);
    } catch (error) {
      next(error);
    }
  }

  async getWorkGroupDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('work group item route');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { id } = req.params;
      const plantData = await workGroupService.getWorkGroupFromId(id);
      if (!plantData) {
        return next(ApiError.NotFound());
      }
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  /**удалить или восстановить группу предприятий adm */
  async stateWorkGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации удаление группы предприятий',
          ),
        );
      }
      const { id } = req.params;
      const { enabled } = req.body;

      const data = await workGroupService.getWorkGroupFromId(id);
      if (!data) {
        return next(ApiError.NotFound());
      }
      data.enabled = enabled;
      data.save();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateWorkGroupItems(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации1'),
        );
      }
      const { id } = req.params;
      const { name, raiting, legend } = req.body;

      const data = await workGroupService.getWorkGroupFromId(id);
      if (!!data) {
        data.name = name;
        data.raiting = raiting;
        data.legend = legend;
        data.save();
        return res.json(data);
      }
      return null;
    } catch (error) {
      next(error);
    }
  }
}
export const workGroupController = new WorkGroupController();
// module.exports = new WorkGroupController();
