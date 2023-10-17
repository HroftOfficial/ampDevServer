import { Request, Response, NextFunction } from 'express';
// import { Request } from '../interfaces/User';
import { zakazesService } from '../service/zakazes-service';
import { allService } from '../service/all-service';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';
import { MulterFileTypes } from '../interfaces/User';
import { Zakaz as zakazModel } from '../models/zakaz.model';

const castArray = (value: any) => (Array.isArray(value) ? value : [value]);

class ZakazesController {
  /** добавить заказ kl  */
  async addZakazes(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации test zakaz'));
      }
      const {
        title,
        details,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_width,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_d,
        kl,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        work_category = '5f51fda156a0c50b1a44c69c',
        many = 0,
        commit = '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        kl_text = '',
        cities,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo = 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        zakaz_access_level = ['0'],
      } = req.body;
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      const history = {
        name: nameUser,
        id: userId,
        messages: 'добавить заказ',
      };
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const inhere_user = userId;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const inhere_user_name = req?.user?.org;
      const user = userId;

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_url, file_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const data = await zakazModel.create({
        title,
        details,
        max_width,
        max_d,
        kl,
        work_category,
        many,
        commit,
        kl_text,
        zakaz_access_level,
        cities,
        photo_url,
        file_url,
        inhere_user,
        inhere_user_name,
        user,
        index_photo,
        history,
      });

      if (Array.isArray(photo_url)) {
        for (const key in photo_url) {
          if (Object.prototype.hasOwnProperty.call(photo_url, key)) {
            const element = photo_url[key];
            const jName = element.filename;
            const filePath = './public/uploads/';
            const fileDest = './public/uploads/tumb/';
            await allService.photoResizeAsync(jName, filePath, fileDest);
          }
        }
      }
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /** добавить заказ adm   */
  async addZakazesAdm(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации test zakaz adm'));
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_url, file_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const {
        title,
        details,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_width,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_d,
        kl,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        work_category = '5f51fda156a0c50b1a44c69c',
        many = 0,
        comment = '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        kl_text = '',
        cities,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo = 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        zakaz_access_level = [0],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user_name,
      } = req.body;
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!userId || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'добавить заказ adm',
      };
      const user = userId;

      const data = await zakazModel.create({
        title,
        details,
        max_width,
        max_d,
        kl,
        work_category,
        many,
        comment,
        kl_text,
        zakaz_access_level,
        cities,
        photo_url,
        file_url,
        inhere_user,
        inhere_user_name,
        user,
        index_photo,
        history,
      });

      if (Array.isArray(photo_url)) {
        for (const key in photo_url) {
          if (Object.prototype.hasOwnProperty.call(photo_url, key)) {
            const element = photo_url[key];
            const jName = element.filename;
            const filePath = './public/uploads/';
            const fileDest = './public/uploads/tumb/';
            await allService.photoResizeAsync(jName, filePath, fileDest);
          }
        }
      }

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**обновление "текстовых" данных заказа kl   */
  async updateZakazToIdClient(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при обновление текстовых данных заказа'),
        );
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'обновление текстовых данных заказа',
      };

      const {
        title,
        details,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_width,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_d,
        kl,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        kl_text,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        work_category = '5f51fda156a0c50b1a44c69c',
        many = 0,
        comment = '',
        cities,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo,
      } = req.body;
      const { id } = req?.params;
      const userData = await zakazesService.updateZakazDetailsClient(
        id,
        user_id,
        title,
        details,
        max_width,
        max_d,
        kl,
        kl_text,
        work_category,
        many,
        comment,
        cities,
        index_photo,
        history,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** удаление чертежей и файлов заказа kl   */
  async deleteZakazFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при удалении фото или файлов zakaza по его ID',
          ),
        );
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'удалениие фото или файлов zakaza',
      };
      const { id } = req?.params;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { delete_files } = req?.body;

      if (!delete_files) {
        return next(ApiError.BadRequest('нечего удалять, список пуст'));
      }
      const userData = await zakazesService.deleteZakazFiles(
        id,
        user_id,
        delete_files,
        history,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** добавление чертежей и файлов kl   */
  async addZakazesFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации добавление чертежей и файлов',
          ),
        );
      }

      const { id } = req?.params;
      // const { photo_url, file_url } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_url, file_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'добавление чертежей и файлов',
      };
      const data = await zakazesService.addZakazesFiles(
        id,
        user_id,
        // photo_url,
        file_url,
        history,
      );

      if (Array.isArray(photo_url)) {
        for (const key in photo_url) {
          if (Object.prototype.hasOwnProperty.call(photo_url, key)) {
            const element = photo_url[key];
            const jName = element.filename;
            const filePath = './public/uploads/';
            const fileDest = './public/uploads/tumb/';
            await allService.photoResizeAsync(jName, filePath, fileDest);
          }
        }
      }

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**обновление заказа в одном файле kl   */
  async updateZakaz(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации обновление заказа'),
        );
      }

      const { id } = req?.params;
      // const { photo_url, file_url } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_url, file_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const {
        title,
        details,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_width,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_d,
        kl,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        kl_text,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        work_category = '5f51fda156a0c50b1a44c69c',
        many = 0,
        comment = '',
        cities,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo = 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        delete_files,
      } = req?.body;

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'изменение заказа',
      };

      //удаление фото и файлов
      if (delete_files) {
        await zakazesService.deleteZakazFiles(
          id,
          user_id,
          castArray(delete_files),
          history,
        );
      }

      //добавление файлов и чертежей
      //добаление файлов
      if (file_url) {
        await zakazesService.addZakazesFiles(id, user_id, file_url, history);
      }

      //добавление фото к заказу
      if (photo_url) {
        await zakazesService.addZakazesPhoto(id, user_id, photo_url, history);
        //делаем привью
        // const values = './public/uploads/';
        // const dest = './public/uploads/tumb/';
        // const resize = 500;
        // photo_url?.map((item) => {
        //   allService.photo_resize(item?.filename, values, dest, resize);
        // });

        if (Array.isArray(photo_url)) {
          for (const key in photo_url) {
            if (Object.prototype.hasOwnProperty.call(photo_url, key)) {
              const element = photo_url[key];
              const jName = element.filename;
              const filePath = './public/uploads/';
              const fileDest = './public/uploads/tumb/';
              await allService.photoResizeAsync(jName, filePath, fileDest);
            }
          }
        }
      }

      //обновляем текстовые данные
      //проверка на наличие данных
      // console.log('Аlarm!!! данные для обновления все или нет (клиент)???', title, details, work_category, cities);
      if (title && details && work_category && cities) {
        await zakazesService.updateZakazDetailsClient(
          id,
          user_id,
          title,
          details,
          max_width,
          max_d,
          kl,
          kl_text,
          work_category,
          many,
          comment,
          cities,
          index_photo,
          history,
        );
      }

      // return res.json({ message: "данные заказа обновлены" });
      return res.status(200).send({ message: 'данные заказа обновлены' });
    } catch (error) {
      next(error);
    }
  }

  /** обновление заказа в одном файле adm   */
  async updateZakazAdm(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации обновление заказа adm'),
        );
      }

      const { id } = req?.params;
      // const { photo_url, file_url } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { photo_url, file_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const {
        title,
        details,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_width,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_d,
        kl,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        kl_text,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        work_category = '5f51fda156a0c50b1a44c69c',
        many = 0,
        comment = '',
        cities,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_photo = 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        delete_files,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        inhere_user_name,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        zakaz_access_level,
      } = req?.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'изменение заказа adm',
      };

      //удаление фото и файлов
      if (delete_files) {
        await zakazesService.deleteZakazFilesAdm(
          id,
          castArray(delete_files),
          history,
        );
      }

      //добавление файлов и чертежей
      //добаление файлов
      if (file_url) {
        await zakazesService.addZakazesFilesAdm(id, file_url, history);
      }

      //добавление фото к заказу
      // console.log(photo_url, req?.files)
      if (photo_url) {
        await zakazesService.addZakazesPhotoAdm(id, photo_url, history);
        //делаем привью
        if (Array.isArray(photo_url)) {
          for (const key in photo_url) {
            if (Object.prototype.hasOwnProperty.call(photo_url, key)) {
              const element = photo_url[key];
              const jName = element.filename;
              const filePath = './public/uploads/';
              const fileDest = './public/uploads/tumb/';
              await allService.photoResizeAsync(jName, filePath, fileDest);
            }
          }
        }
      }

      //обновляем текстовые данные
      //проверка на наличие данных
      // console.log('Аlarm!!! данные для обновления все или нет (админка) ???',title, details, work_category, cities)
      if (title && details && work_category && cities) {
        await zakazesService.updateZakazDetailsAdm(
          id,
          user_id,
          title,
          details,
          max_width,
          max_d,
          kl,
          kl_text,
          work_category,
          many,
          comment,
          cities,
          index_photo,
          inhere_user,
          inhere_user_name,
          zakaz_access_level,
          history,
        );
      }

      // return res.json({ message: "данные заказа обновлены" });
      return res.status(200).send({ message: 'данные заказа обновлены' });
    } catch (error) {
      next(error);
    }
  }

  /** получить все заказы adm   */
  async getAllZakazes(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при получении всех заказов'));
      }
      const userData = await zakazesService.getAllZakazes();
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**получить заказ по ID adm   */

  async getZakazesToId(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при получении заказ по ID adm'),
        );
      }
      const { id } = req?.params;
      const userData = await zakazesService.getZakazesToId(id);
      // console.log('Ошибка при получении заказ по ID adm', userData)
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** получить все заказы владельцем которых является пользователь по его ID kl   */
  async getZakazesToIdClient(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при получении заказов пользователя по его ID',
          ),
        );
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      if (!user_id) {
        return null;
      }
      // console.log("getZakazesToIdClient user_id controller >>>>>> ", user_id);
      const userData = await zakazesService.getZakazesToIdClient(user_id);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** активировать - деактивировать пользователя портала adm   */
  async changeState(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации change state'));
      }
      const { id } = req.params;
      const { enabled } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'активировать заказ',
      };
      const checkZakaz = await zakazesService.getZakazToId(id);
      if (!checkZakaz) {
        return next(ApiError.NotFound());
      }
      const filter = { _id: id };
      let update = {};
      if (enabled) {
        update = { deleted: false, enabled, $push: { history: history } };
      } else {
        update = { enabled, $push: { history: history } };
      }
      const zakazData = await zakazesService.changeValuesZakaz(update, filter);
      return res.json(zakazData);
    } catch (error) {
      next(error);
    }
  }

  /** пометка на удаление пользователя портала adm   */
  async deleteZakaz(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации(удаление пользователя)'),
        );
      }
      const { id } = req.params;
      const { deleted } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'удаление заказа',
      };

      const checkZakaz = await zakazesService.getZakazToId(id);
      if (!checkZakaz) {
        return next(ApiError.NotFound());
      }
      const filter = { _id: id };
      let update = {};
      if (deleted) {
        update = { deleted, enabled: false, $push: { history: history } };
      } else {
        update = { deleted, $push: { history: history } };
      }
      const zakazData = await zakazesService.changeValuesZakaz(update, filter);
      return res.json(zakazData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * favorite
   */

  /** добавить пользователю заказ в favorite   */
  async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации add favorite'));
      }
      const { favorite } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'добавить favorite',
      };
      // console.log('req body add',req.body,favorite )
      const data = await zakazesService.addZakazesFavorite(
        user_id,
        favorite,
        history,
      );
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**удалить у пользователя заказ из favorite   */
  async deleteFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации delete favorite'),
        );
      }
      const { favorite } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'удалить favorite',
      };
      // console.log('req body deleted',req.body,favorite )
      const data = await zakazesService.deleteZakazesFavorite(
        user_id,
        favorite,
        history,
      );
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**отдать все заказы пользователя по признаку favorite   */
  async getFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при получить favorite пользователя'),
        );
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      if (!user_id) {
        return null;
      }
      const data = await zakazesService.getZakazesFavorite(user_id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /** история заказа по его ID   */
  async getHistoryToId(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при получить историю заказа'));
      }
      const { id } = req?.params;
      const data = await zakazesService.getHistoryToId(id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /** фото для телеграм adm   */
  async updateTelegram(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации обновление фото телеграм adm',
          ),
        );
      }

      const { id } = req?.params;
      // const { telegram_url } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { telegram_url } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { delete_files } = req?.body;

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!user_id || !nameUser) {
        return null;
      }
      const history = {
        name: nameUser,
        id: user_id,
        messages: 'изменение фото телеграм adm',
      };

      //удаление фото и файлов
      if (delete_files) {
        await zakazesService.deleteZakazFilesAdm(
          id,
          castArray(delete_files),
          history,
        );
      }

      //добавление файлов и чертежей
      //добаление файлов
      if (telegram_url) {
        await zakazesService.addZakazesTelegramAdm(id, telegram_url, history);
      }
      return res.status(200).send({ message: 'данные заказа обновлены' });
    } catch (error) {
      next(error);
    }
  }

  //deleteFileZakaz
  //delete files or photo zakaz to server
  async deleteFileZakaz(req: Request, res: Response, next: NextFunction) {
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
        messages: 'удаление файлов(фото) заказа adm',
      };
      const path = 'public/uploads/';
      const result = await zakazesService.deleteZakazFilesAdmNew(
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
}

export const zakazesController = new ZakazesController();
// module.exports = new ZakazesController();
