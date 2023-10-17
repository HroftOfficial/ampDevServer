import { Request, Response, NextFunction } from 'express';
import { plantApService } from '../service/plant-serviceAp';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';
import { config } from '../config/config';
import { allService } from '../service/all-service';

const { DESTINATION_PLANT_AP, PLANT_LIMIT } = config;

class PlantApController {
  //get all plant
  async getPlant(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const plants = await plantApService.getPlants();
      // console.log('plant', plants);
      return res.json(plants);
    } catch (error) {
      next(error);
    }
  }

  //get plant profile
  async getPlantProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
	  if (!userId) { return null;}
      const profilePlant = await plantApService.getPlantProfile(userId);
      return res.json(profilePlant);
    } catch (error) {
      next(error);
    }
  }

  //create plant
  async createPlant(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('route create plant');
      const errors = validationResult(req);
      const {
        name,
        sortNumber,
        enabled,
        deleted,
        newPlant,
        plantGroup,
        info,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user_name,
        cities,
        price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo,
      } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_plant, file_plant } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const userId = req.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'добавить оборудование adm',
      };
      const inhereUser = {
        inhereUserId: inhere_user,
        inhereUserName: inhere_user_name,
      };
      // console.log(inhereUser)

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      if (photo_plant) {
        //делаем привью
        if (Array.isArray(photo_plant)) {
          for (const key in photo_plant) {
            if (Object.prototype.hasOwnProperty.call(photo_plant, key)) {
              const element = photo_plant[key];
              const jName = element.filename;
              const filePath = `./public/uploads/${DESTINATION_PLANT_AP}/`;
              const fileDest = `./public/uploads/${DESTINATION_PLANT_AP}/thumb/`;
              await allService.photoResizeAsync(jName, filePath, fileDest);
            }
          }
        }

      }
      const plantData = await plantApService.createPlant(
        name,
        sortNumber,
        newPlant,
        plantGroup,
        info,
        photo_plant,
        file_plant,
        inhereUser,
        cities,
        price,
        index_photo,
        history,
        enabled,
        deleted,
      );
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  /**start favorite */
  async getFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(
          ApiError.BadRequest('Ошибка при получении favorite пользователя'),
        );
      }
      const data = await plantApService.getFavoriteToId(userId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  
  /**add plant favorite to User  */
  async addFavorite(req: Request, res: Response, next: NextFunction) {
    // console.log('add favorite plant');
    try {
      const { favorite } = req.body;
      const userId = req.user?._id;
      if (!userId) { return null;}
      const data = await plantApService.addPlantFavorite(userId, favorite);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
  
  //delete favorite to user
  async deleteFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { favorite } = req.body;
      const userId = req.user?._id;
      if (!userId) { return null;}
      const data = await plantApService.deletePlantFavorite(userId, favorite);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  //add plant profile
  async addPlantProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      const {
        name,
        sortNumber,
        enabled,
        deleted,
        newPlant,
        plantGroup,
        info,
        cities,
        price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo,
      } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_plant, file_plant } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
	  const nameUser = req.user?.name;
	  const userId = req.user?._id;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'добавить оборудование adm',
      };
      const inhereUser = {
        inhereUserId: userId,
        inhereUserName: nameUser,
      };
      // console.log(inhereUser)

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      if (photo_plant) {
        // await plantApService.addZakazesPhotoAdm(id, photo_plant, history);
        //делаем привью
        if (Array.isArray(photo_plant)) {
          for (const key in photo_plant) {
            if (Object.prototype.hasOwnProperty.call(photo_plant, key)) {
              const element = photo_plant[key];
              const jName = element.filename;
              const filePath = `./public/uploads/${DESTINATION_PLANT_AP}/`;
              const fileDest = `./public/uploads/${DESTINATION_PLANT_AP}/thumb/`;
              await allService.photoResizeAsync(jName, filePath, fileDest);
            }
          }
        }
      }
      const plantData = await plantApService.createPlant(
        name,
        sortNumber,
        newPlant,
        plantGroup,
        info,
        photo_plant,
        file_plant,
        inhereUser,
        cities,
        price,
        index_photo,
        history,
        enabled,
        deleted,
      );
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  //update plant
  async updatePlantProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации1'),
        );
      }
      const { id } = req.params;
      const {
        name,
        sortNumber,
        enabled,
        newPlant,
        plantGroup,
        info,
        price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo,
        // cities,
      } = req.body;

      // const { photo_plant, file_plant } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_plant, file_plant } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
	  const userId = req.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'изменение оборудования adm',
      };
      const inhereUser = {
        inhereUserId: userId,
        inhereUserName: nameUser,
      };
      // console.log("update plant controller", history, id, inhereUser)

      //добавление файлов и чертежей
      //добаление файлов
      if (file_plant) {
        await plantApService.addPlantFilesAdm(id, file_plant, history);
      }

      //добавление фото к заказу
      // console.log(photo_url, req?.files)
      if (photo_plant) {
        await plantApService.addPlantPhotoAdm(id, photo_plant, history);
        //делаем привью
        if (Array.isArray(photo_plant)) {
          for (const key in photo_plant) {
            if (Object.prototype.hasOwnProperty.call(photo_plant, key)) {
              const element = photo_plant[key];
              const jName = element.filename;
              const filePath = `./public/uploads/${DESTINATION_PLANT_AP}/`;
              const fileDest = `./public/uploads/${DESTINATION_PLANT_AP}/thumb/`;
              console.log('test >> ', filePath, fileDest)
              await allService.photoResizeAsync(jName, filePath, fileDest);
            }
          }
        }
      }

      const updateResult = await plantApService.updatePlant(
        id,
        name,
        sortNumber,
        enabled,
        newPlant,
        plantGroup,
        info,
        inhereUser,
        price,
        index_photo,
        // cities,
        history,
      );

      return res.json(updateResult);
    } catch (error) {
      next(error);
    }
  }

  async deletePlantProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await plantApService.deletePlantProfile(id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  //unDeletePlantProfile
  async unDeletePlantProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await plantApService.unDeletePlantProfile(id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  //post filter plant page
  async postFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const { mainGroup, plantGroups, limit = PLANT_LIMIT } = req.body;
      const { page = '1' } = req.params;
      const offset = limit * parseInt(page) - limit;
      let result = null;
      if (plantGroups?.length < 1) {
        //not group
        result = await plantApService.getMainGroupPlant(
          mainGroup,
          offset,
          limit,
        );
      } else {
        result = await plantApService.getPlantGroupPlant(
          plantGroups,
          offset,
          limit,
        );
      }  
      res.set('x-total-plant', result?.count.toString());
      return res.json(result.data);
    } catch (error) {
      next(error);
    }
  }

  async getPlantDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { id } = req.params;
      const plantData = await plantApService.getPlantFromId(id);
      if (!plantData) {
        return next(ApiError.NotFound());
      }
      return res.json(plantData);
    } catch (error) {
      next(error);
    }
  }

  //update plant
  async updatePlantAll(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации1'),
        );
      }
      const { id } = req.params;
      const {
        name,
        sortNumber,
        enabled,
        newPlant,
        plantGroup,
        info,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user_name,
        price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo,
      } = req.body;

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_plant, file_plant } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const nameUser = req.user?.name;
      const userId = req.user?._id;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'изменение оборудования adm',
      };
      const inhereUser = {
        inhereUserId: inhere_user,
        inhereUserName: inhere_user_name,
      };

      //добавление файлов и чертежей
      //добаление файлов
      if (file_plant) {
        await plantApService.addPlantFilesAdm(id, file_plant, history);
      }

      //добавление фото к заказу
      // console.log(photo_url, req?.files)
      if (photo_plant) {
        await plantApService.addPlantPhotoAdm(id, photo_plant, history);
        //делаем привью

        if (Array.isArray(photo_plant)) {
          for (const key in photo_plant) {
            if (Object.prototype.hasOwnProperty.call(photo_plant, key)) {
              const element = photo_plant[key];
              const jName = element.filename;
              const filePath = `./public/uploads/${DESTINATION_PLANT_AP}/`;
              const fileDest = `./public/uploads/${DESTINATION_PLANT_AP}/thumb/`;
              await allService.photoResizeAsync(jName, filePath, fileDest);
            }
          }
        }
      }

      const updateResult = await plantApService.updatePlant(
        id,
        name,
        sortNumber,
        enabled,
        newPlant,
        plantGroup,
        info,
        inhereUser,
        price,
        index_photo,
        history,
      );

      return res.json(updateResult);
    } catch (error) {
      next(error);
    }
  }

  //delete files or photo plant to server
  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename } = req.body;
      const { id } = req.params;
      // console.log(filename)
      if (!filename) {
        return next(ApiError.BadRequest('No file name'));
      }
	  const nameUser = req.user?.name;
	  const userId = req.user?._id;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'удаление файлов(фото) оборудования adm',
      };
      const path = `public/uploads/${DESTINATION_PLANT_AP}`;
      const result = await plantApService.deletePlantFilesAdm(
        id,
        filename,
        path,
        history,
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  //mark delete plant
  async deletePlant(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(оборудование)',
          ),
        );
      }
      const { id } = req.params;
      let { deleted, enabled } = req.body;
      // console.log(req.body);

      if (!deleted) {
        enabled = true;
      } else {
        enabled = false;
      }
      const plantDelete = await plantApService.deletePlant(
        id,
        enabled,
        deleted,
      );
      return res.json(plantDelete);
    } catch (error) {
      next(error);
    }
  }

  //mark enabled plant
  async enabledPlant(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(оборудование)',
          ),
        );
      }
      const { id } = req.params;
      let { enabled, deleted } = req.body;
      // console.log(req.body)
      if (!enabled) {
        deleted = true;
      } else {
        deleted = false;
      }

      const plantDelete = await plantApService.deletePlant(
        id,
        enabled,
        deleted,
      );
      return res.json(plantDelete);
    } catch (error) {
      next(error);
    }
  }

  //change cities
  async changeCities(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('change cities route');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации смены населенного пункта',
          ),
        );
      }
      const { id } = req.params;
      const { cities } = req.body;
      if (!cities) {
        return null;
      }
	  const nameUser = req.user?.name;
	  const userId = req.user?._id;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
	  const history = {
        name: nameUser,
        id: userId,
        messages: 'изменение города',
      };
      const userData = await plantApService.changeCities(id, cities, history);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  //get history
  async getHistoryToId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await plantApService.getHistoryToId(id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

}
export const plantApController = new PlantApController();

