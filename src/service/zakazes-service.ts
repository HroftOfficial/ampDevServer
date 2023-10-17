import { Zakaz, Zakaz as zakazModel } from "../models/zakaz.model";
import { userModelAmp } from "../models/userAmp.model";
import { allService } from "./all-service";
import { History } from "../interfaces/User";

const castArray = (value: any) => (Array.isArray(value) ? value : [value]);

class ZakazesService {
  /** Добавить заказ kl   */
  async addZakazes(
    title: string,
    details: string,
    max_width: string,
    max_d: string,
    kl: number,
    kl_text: string,
    work_category: string[],
    many: number,
    cities: string,
    index_photo: number,
    inhere_user: string,
    inhere_user_name: string,
    zakaz_access_level: string[],
    history: History,
    photo_url: {
      [fieldname: string]: Express.Multer.File[];
    },
    file_url: {
      [fieldname: string]: Express.Multer.File[];
    },
    user: string
  ) {
    const result = await zakazModel.create({
      title,
      details,
      max_width,
      max_d,
      kl,
      work_category,
      many,
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
    return result;
  }

  /** Добавить заказ adm   */
  async addZakazesAdm(
    title: string,
    details: string,
    max_width: string,
    max_d: string,
    kl: number,
    kl_text: string,
    work_category: string[],
    many: number,
    cities: string,
    index_photo: number,
    inhere_user: string,
    inhere_user_name: string,
    zakaz_access_level: string[],
    history: History,
    photo_url: {
      [fieldname: string]: Express.Multer.File[];
    },
    file_url: {
      [fieldname: string]: Express.Multer.File[];
    },
    user: string
  ) {
    const result = await zakazModel.create({
      title,
      details,
      max_width,
      max_d,
      kl,
      work_category,
      many,
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
    return result;
  }

  /**получаем все заказы adm   */
  async getAllZakazes() {
    const result = await zakazModel.find().sort({ _id: -1 });
    return result;
  }

  /** получить заказ ро его ID adm   */
  async getZakazesToId(id: string) {
    const result = await zakazModel.findById(id);
    return result;
  }

  /** получаем все заказы пользователя владельцем которыйх он является kl   */
  async getZakazesToIdClient(user_id: string) {
    const result = await zakazModel
      .find(
        { inhere_user: user_id },
        {
          _id: 1,
          title: 1,
          details: 1,
          max_width: 1,
          max_d: 1,
          kl: 1,
          work_category: 1,
          many: 1,
          kl_text: 1,
          cities: 1,
          photo_url: 1,
          file_url: 1,
          deleted: 1,
          enabled: 1,
          work_info: 1,
          number: 1,
          index_photo: 1,
        }
      )
      .sort({ _id: -1 });
    return result;
  }

  /** удаление или восстановление заказа kl   */
  async deleteZakaz(
    id: string,
    user_id: string,
    deleted: boolean,
    history: History
  ) {
    const filter = { _id: id, inhere_user: user_id };
    /**
     * пользователь может удалить заказ deleted:true enabled:false
     * и восстановить(отправить на модерацию) deleted:false enabled: false
     */
    const update = { enabled: false, deleted, $push: { history: history } };
    const result = await zakazModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /** обновление "текстовых данных заказа" kl   */
  async updateZakazDetailsClient(
    id: string,
    user_id: string,
    title: string,
    details: string,
    max_width: string,
    max_d: string,
    kl: number,
    kl_text: string,
    work_category: string[],
    many: number,
    comment: string,
    cities: string,
    index_photo: number,
    history: History
  ) {
    const infoArray = castArray(work_category);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const work_data_info = [];
    if (infoArray) {
      for (const key in infoArray) {
        if (Object.hasOwnProperty.call(infoArray, key)) {
          const element = infoArray[key];
          work_data_info.push(await allService.getWorkInfo(element));
        }
      }
    }
    const filter = { _id: id, inhere_user: user_id };
    const update = {
      title,
      details,
      max_width,
      max_d,
      kl,
      kl_text,
      work_category,
      work_info: work_data_info,
      many,
      comment,
      index_photo,
      cities,
      $push: { history: history },
    };
    const result = await zakazModel.findByIdAndUpdate(filter, update, {
      projection: {
        title: 1,
        details: 1,
        max_width: 1,
        max_d: 1,
        kl: 1,
        kl_text: 1,
        work_category: 1,
        work_info: 1,
        many: 1,
        comment:1,
        cities: 1,
        index_photo: 1,
      },
    });
    return result;
  }

  /**обновление "текстовых данных заказа" adm   */
  async updateZakazDetailsAdm(
    id: string,
    user_id: string,
    title: string,
    details: string,
    max_width: string,
    max_d: string,
    kl: number,
    kl_text: string,
    work_category: string[],
    many: number,
    comment: string,
    cities: string,
    index_photo: number,
    inhere_user: string,
    inhere_user_name: string,
    zakaz_access_level: string[],
    history: History
  ) {
    const infoArray = castArray(work_category);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const work_data_info = [];
    if (infoArray) {
      for (const key in infoArray) {
        if (Object.hasOwnProperty.call(infoArray, key)) {
          const element = infoArray[key];
          work_data_info.push(await allService.getWorkInfo(element));
        }
      }
    }
    const filter = { _id: id, inhere_user: user_id };
    const update = {
      title,
      details,
      max_width,
      max_d,
      kl,
      kl_text,
      work_category,
      work_info: work_data_info,
      many,
      comment,
      index_photo,
      cities,
      inhere_user,
      inhere_user_name,
      zakaz_access_level,
      $push: { history: history },
    };
    const result = await zakazModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /**удаление файлов zakaza kl   */
  async deleteZakazFiles(
    id: string,
    user_id: string,
    delete_files: { filename: string }[],
    history: History
  ) {
    if (!delete_files) {
      return null;
    }
    const data = await zakazModel.find({ _id: id, inhere_user: user_id });
    if (!data) {
      return null;
    }

    for (const key in delete_files) {
      if (Object.prototype.hasOwnProperty.call(delete_files, key)) {
        const element = delete_files[key];
        await allService.unlinkFile("public/uploads/" + element);
        await allService.unlinkFile("public/uploads/tumb/" + element);
      }
    }

    const filter = { _id: id, inhere_user: user_id };
    const update = {
      $pull: {
        photo_url: { filename: { $in: delete_files } },
        file_url: { filename: { $in: delete_files } },
      },
      $push: { history: history },
    };
    await zakazModel.updateOne(filter, update);
    return { message: "файлы удалены" };
  }

  /** удаление файлов zakaza adm   */
  async deleteZakazFilesAdm(
    id: string,
    delete_files: { filename: string }[],
    history: History
  ) {
    if (!delete_files) {
      return null;
    }
    const data = await zakazModel.find({ _id: id });
    if (!data) {
      return null;
    }
    for (const key in delete_files) {
      if (Object.prototype.hasOwnProperty.call(delete_files, key)) {
        const element = delete_files[key];
        await allService.unlinkFile("public/uploads/" + element);
        await allService.unlinkFile("public/uploads/tumb/" + element);
      }
    }

    const filter = { _id: id };
    const update = {
      $pull: {
        photo_url: { filename: { $in: delete_files } },
        file_url: { filename: { $in: delete_files } },
        telegram_url: { filename: { $in: delete_files } },
      },
      $push: { history: history },
    };
    await zakazModel.updateOne(filter, update);
    return { message: "файлы удалены" };
  }

  /** добаление файлов к заказу kl   */
  async addZakazesFiles(
    id: string,
    user_id: string,
    file_url: { filename: string }[],
    history: History
  ) {
    const data = await zakazModel.findOne(
      { _id: id, inhere_user: user_id },
      { file_url: 1, _id: 0 }
    );
    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_file = data?.file_url;
    if (!!prev_file) {
      const filter = { _id: id, inhere_user: user_id };
      const update = {
        $set: { file_url: [...prev_file, ...file_url] },
        $push: { history: history },
      };
      const result = await zakazModel.findOneAndUpdate(filter, update, {
        projection: { file_url: 1 },
      });
      return result;
    }
  }

  /** добаление файлов к заказу adm   */
  async addZakazesFilesAdm(
    id: string,
    file_url: { filename: string }[],
    history: History
  ) {
    const data = await zakazModel.findOne({ _id: id }, { file_url: 1, _id: 0 });
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

      const result = await zakazModel.findOneAndUpdate(filter, update, {
        projection: { file_url: 1 },
      });
      return result;
    }
  }

  /** добаление чертежей для телеграм к заказу adm   */
  async addZakazesTelegramAdm(
    id: string,
    telegram_url: Express.Multer.File[],
    history: History
  ) {
    const data = await zakazModel.findOne(
      { _id: id },
      { telegram_url: 1, _id: 0 }
    );
    if (!data) {
      return null;
    }
    const filter = { _id: id };
    const update = {
      $set: { telegram_url: telegram_url },
      $push: { history: history },
    };

    const result = await zakazModel.findOneAndUpdate(filter, update, {
      projection: { telegram_url: 1 },
    });
    return result;
  }

  /** добаление фото к заказу kl   */
  async addZakazesPhoto(
    id: string,
    user_id: string,
    photo_url: { filename: string }[],
    history: History
  ) {
    const data = await zakazModel.findOne(
      { _id: id, inhere_user: user_id },
      { photo_url: 1, _id: 0 }
    );
    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_photo = data?.photo_url;
    if (!!prev_photo) {
      const filter = { _id: id, inhere_user: user_id };
      const update = {
        $set: { photo_url: [...prev_photo, ...photo_url] },
        $push: { history: history },
      };

      const result = await zakazModel.findOneAndUpdate(filter, update, {
        projection: { photo_url: 1 },
      });
      return result;
    }
  }

  /**добаление фото к заказу adm   */
  async addZakazesPhotoAdm(
    id: string,
    photo_url: { filename: string }[],
    history: History
  ) {
    const data = await zakazModel.findOne(
      { _id: id },
      { photo_url: 1, _id: 0 }
    );
    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_photo = data?.photo_url;
    if (!!prev_photo) {
      const filter = { _id: id };
      const update = {
        $set: { photo_url: [...prev_photo, ...photo_url] },
        $push: { history: history },
      };

      const result = await zakazModel.findOneAndUpdate(filter, update, {
        projection: { photo_url: 1 },
      });

      return result;
    }
  }
  /**favorite */

  /** add favorite   */
  async addZakazesFavorite(
    user_id: string,
    favorite: string,
    history: History
  ) {
    const filter = { _id: user_id };
    const update = {
      $push: { history: history, favorite: favorite },
    };
    const result = await userModelAmp.findOneAndUpdate(filter, update);
    return result;
  }

  /** delete favorite   */
  async deleteZakazesFavorite(
    user_id: string,
    favorite: string,
    history: History
  ) {
    const filter = { _id: user_id };
    const update = {
      $pull: { favorite: favorite },
      $push: { history: history },
    };
    const result = await userModelAmp.findOneAndUpdate(filter, update);
    return result;
  }

  /** get favorite   */
  async getZakazesFavorite(user_id: string) {
    const getFavoriteUserPortal = await userModelAmp.find(
      { _id: user_id, favorite: { $exists: true, $not: { $size: 0 } } },
      { _id: 0, favorite: 1 }
    );
    const result = await zakazModel.find({
      _id: { $in: getFavoriteUserPortal?.[0]?.favorite },
    });
    return result;
  }

  /**получаем заказ по его id adm   */
  async getZakazToId(id: string) {
    const result = await zakazModel.findOne({ _id: id });
    return result;
  }

  /** изменяем значения в БД по заказу   */
  async changeValuesZakaz(update: any, filter: any) {
    const result = await zakazModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /**получить историю заказа по его ID   */
  async getHistoryToId(id: string) {
    const result = await zakazModel.findOne(
      { _id: id },
      { history: 1, _id: 0 }
    );
    return result;
  }

  /**удаление фото или файла в заказе */
  async deleteZakazFilesAdmNew(
    id: string,
    filename: string,
    path: string,
    history: History
  ) {
    if (!filename) {
      return null;
    }

    await allService.unlinkFile(`${path}/${filename}`);
    await allService.unlinkFile(`${path}/thumb/${filename}`);

    const filter = { _id: id };
    const update = {
      $pull: {
        photo_url: { filename: { $in: [filename] } },
        file_url: { filename: { $in: [filename] } },
      },
      $push: { history: history },
    };
    const result = await Zakaz.updateOne(filter, update, {
      returnOriginal: false });
    return result;
  }
}

export const zakazesService = new ZakazesService();
