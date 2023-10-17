import { Request, Response, NextFunction } from 'express';
import { plantGroupServiceAp } from '../service/plantGroup-serviceAp';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';

class PlantGroupApController {
  /**new code */
  /**удалить или восстановить группу оюорудования adm */
  async statePlantGroup(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации изменении группы оборудования',
          ),
        );
      }
      const { id } = req.params;
      const { enabled } = req.body;
      const data = await plantGroupServiceAp.getPlantGroupFromId(id);
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

  //create plant group
  async createPlant(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      const { name, enabled, plantGroupAp } = req.body;
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const plantData = await plantGroupServiceAp.createPlant(
        name,
        enabled,
        plantGroupAp,
      );
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  //get plant group
  async getPlant(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const plants = await plantGroupServiceAp.getPlants();
      // console.log('plant group data', plants)
      return res.json(plants);
    } catch (error) {
      next(error);
    }
  }

  //get plant group to ID
  async getPlantDetails(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { id } = req.params;
      const plantData = await plantGroupServiceAp.getPlantFromId(id);
      if (!plantData) {
        return next(ApiError.NotFound());
      }
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  async updatePlantAll(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации1'),
        );
      }
      const { id } = req.params;
      const { name, plantGroupAp, enabled } = req.body;

      const result = await plantGroupServiceAp.getPlantFromId(id);
      const data = result[0];
      // console.log("<<DATA>>", data, id);
      if (!data) {
        return next(
          ApiError.BadRequest('Ошибка при валидации not data'),
        );
      }

      const updatePlantGroup = await plantGroupServiceAp.savePlantGroup(
        id,
        name,
        plantGroupAp,
        enabled,
      );
      return res.json(updatePlantGroup);
    } catch (error) {
      next(error);
    }
  }
  /**new code */
}

export const plantGroupControllerApp = new PlantGroupApController();
