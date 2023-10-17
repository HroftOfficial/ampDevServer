import { Request, Response, NextFunction } from "express";
import { mainPlantGroupApService } from "../service/mainPlantGroup-service-Ap";
import { validationResult } from "express-validator";
import ApiError from "../exertions/api-error";

class MainPlantGroupApController {
  /**new code */
  //get main plant group
  async getPlant(req: Request, res: Response, next: NextFunction) {
    try {
      const plants = await mainPlantGroupApService.getPlants();
      return res.json(plants);
    } catch (error) {
      next(error);
    }
  }

  //create main plant group
  async createPlant(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      const { name, sortNumber, enabled } = req.body;
      // const { main_photo_plant } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const main_photo_plant = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      // console.log("<<create main plant group>>",name, sortNumber, enabled , req.files)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(' Ошибка при валидации '));
      }
      const images = main_photo_plant;
      const plantData = await mainPlantGroupApService.createPlant(
        name,
        sortNumber,
        enabled,
        images
      );
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  /**удалить или восстановить группу оюорудования adm*/
  async statePlantGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Ошибка при валидации изменении группы оборудования"
          )
        );
      }
      const { id } = req.params;
      const { enabled } = req.body;
      const data = await mainPlantGroupApService.getPlantFromId(id);
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

  /**смена логотипа оборудования adm*/
  async changeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Ошибка при валидации логотип группы оборудования"
          )
        );
      }
      const nameUser = req?.user?.name;
      const idUser = req?.user?._id;
      if (!nameUser || !idUser) {
        return res.status(500).json({
          messsage: "не коректный ID",
        });
      }
      const history = {
        name: nameUser,
        id: idUser,
        messages: " смена логотипа оборудования ",
      };
      const { id } = req.params;
      // const { main_photo_plant } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const main_photo_plant = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (!main_photo_plant) {
        return null;
      }
      const images = main_photo_plant;
      const result = await mainPlantGroupApService.changeImage(
        id,
        history,
        images
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  //get main plant group to ID
  async getPlantDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка при валидации"));
      }
      const { id } = req.params;
      const plantData = await mainPlantGroupApService.getPlantFromId(id);
      if (!plantData) {
        return next(ApiError.NotFound());
      }
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  //update main plant group to ID
  async updatePlantAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(' Ошибка при валидации1 '));
      }
      const { id } = req.params;
      const { name, sortNumber, enabled } = req.body;
      const result = await mainPlantGroupApService.updatePlantAll(
        id,
        name,
        sortNumber,
        enabled,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  //change delete parameter
  async deletePlantGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка при валидации"));
      }
      const { id } = req.params;
      const { enabled } = req.body;
      const data = await mainPlantGroupApService.getPlantFromId(id);
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

  /**new code */
}
export const mainPlantGroupApController = new MainPlantGroupApController();
// module.exports = new MainPlantGroupApController();
