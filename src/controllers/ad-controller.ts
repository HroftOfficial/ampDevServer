import { Request, Response, NextFunction } from 'express';
import { adService } from '../service/ad-service';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';

import { Ad as adModel } from '../models/ad.model';

const castArray = (value: any) => (Array.isArray(value) ? value : [value]);

class AdController {
  /**
   * добавить заказ adm
   */
  async addAd(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации добавление рекламы',
          ),
        );
      }
      // const { photo_url, file_url, preview_url } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_url, file_url, preview_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const {
        title,
        description,
        url,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        top_place,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        side_place,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        card_place,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        card_text,
        overlay,
        enabled,
      } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !user_id) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'добавить рекламу',
      };

      // console.log('add реклама >>>> ', req?.body);

      const data = await adService.addAd(
        title,
        description,
        url,
        top_place,
        side_place,
        card_place,
        card_text,
        overlay,
        enabled,
        photo_url,
        file_url,
        preview_url,
        history,
      );
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * обновление рекламы в одном файле adm
   */
  async updateAd(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации обновление рекламмы',
          ),
        );
      }

      const { id } = req?.params;
      // const { photo_url, file_url, preview_url } = req.files;
      // console.log('files ad', photo_url, file_url, preview_url, req?.files)
      const {
        title,
        description,
        url,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        top_place,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        side_place,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        card_place,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        card_text,
        overlay,
        enabled,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        delete_files,
      } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !user_id) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'изменение рекламы',
      };

      //удаление фото и файлов
      if (delete_files) {
        await adService.deleteAdFiles(
          id,
          castArray(delete_files),
          history,
        );
      }

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_url, file_url, preview_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      //добавление файлов и чертежей
      //добаление файлов
      if (file_url) {
        // await adService.addAdFiles(id, file_url, history);
        const data = await adModel.findOne({ _id: id }, { file_url: 1, _id: 0 });

        if (!data) {
          return null;
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const prev_file = data?.file_url;
        if (!!prev_file) {
          const filter = { _id: id };
          const update = {
            $set: { file_url: [...prev_file, ...file_url] },
            $push: { history: history },
          };

          const result = await adModel.findOneAndUpdate(filter, update, {
            projection: { file_url: 1 },
          });
          return result;
        }
      }
      //добаление файлов preview_url
      if (preview_url) {
        await adService.addAdPhotoPreview(id, preview_url, history);
      }

      //добавление фото к заказу
      // console.log(photo_url, req?.files)
      if (photo_url) {
        await adService.addAdPhoto(id, photo_url, history);
      }

      //обновляем текстовые данные
      //проверка на наличие данных
      // console.log('Аlarm!!! данные для обновления все или нет (админка) ???',title, details, work_category, cities)
      if (title && description) {
        await adService.updateAdDetails(
          id,
          user_id,
          title,
          description,
          url,
          top_place,
          side_place,
          card_place,
          card_text,
          overlay,
          enabled,
          history,
        );
      }
      return res.status(200).send({ message: 'данные по рекламе обновлены' });
    } catch (error) {
      next(error);
    }
  }


  /**
   * получить всю рекламму
   */
  async getAllAd(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при получении всей рекламмы',
          ),
        );
      }
      const userData = await adService.getAllAd();
      // console.log(' controller Ad >> ', userData );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * получить рекламму по ID
   */

  async getAdToId(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при получении рекламмы по ID adm',
          ),
        );
      }
      const { id } = req?.params;
      const userData = await adService.getAdToId(id);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * активировать - деактивировать пользователя портала adm
   */
  async changeState(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации change state рекламмы',
          ),
        );
      }
      const { id } = req.params;
      const { enabled } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'активировать рекламму',
      };
      const checkAd = await adService.getAdToId(id);
      if (!checkAd) {
        return next(ApiError.NotFound());
      }
      const filter = { _id: id };
      const update = { enabled, $push: { history: history } };
      const zakazData = await adService.changeValuesZakaz(update, filter);
      return res.json(zakazData);
    } catch (error) {
      next(error);
    }
  }
  

  /**
 * удаление рекламмы
 */
  async deleteAd(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации удаление рекламмы'));
      }
      const { id } = req.params;
      const userData = await adService.deleteAd(id);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

}

export const adController = new AdController();
// module.exports = new AdController();
