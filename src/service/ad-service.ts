import { History } from '../interfaces/User';
import { Ad as adModel } from '../models/ad.model';
import { config } from '../config/config';
import { allService } from './all-service';

const castArray = (value: any) => (Array.isArray(value) ? value : [value]);

class AdService {
  /**
   * Добавить заказ adm
   */
  async addAd(
    title: string,
    description: string,
    url: string,
    top_place: string,
    side_place: string,
    card_place: string,
    card_text: string,
    overlay: string,
    enabled: boolean,
    photo_url: Express.Multer.File[],
    file_url: Express.Multer.File[],
    preview_url: Express.Multer.File[],
    history:History,
  ) {
    const newAd = {
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
    };
    const result = await new adModel(newAd).save();
    return result;
  }

  /** удаление файлов рекламы  */
  async deleteAdFiles(id: string, delete_files:string[], history:History) {
    if (!delete_files) {
      return null;
    }
    const data = await adModel.find({ _id: id });
    if (!data) {
      return null;
    }

    delete_files?.map((item) => {
      console.log('delete', `public/uploads/${config?.DESTINATION_AD}/` + item);
      const options = `public/uploads/${config?.DESTINATION_AD}/` + item;
      allService.unlinkFile(options);
    });

    const filter = { _id: id };
    const update = {
      $pull :{
        photo_url: { filename: { $in: delete_files } },
        file_url: { filename: { $in: delete_files } },
        preview_url: { filename: { $in: delete_files } },
      },
      $push: { history: history },
    };

    await adModel.updateOne(filter, update);
    return { message: 'файлы удалены' };
  }

  /**
   * добаление файлов к рекламе adm
   */
  async addAdFiles(id: string, file_url:{
    [fieldname: string]: Express.Multer.File[];
  }, history:History) {
    const data = await adModel.findOne({ _id: id }, { file_url: 1, _id: 0 });

    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_file = data?.file_url;
    if (!!prev_file) {
      const filter = { _id: id };
      const update = {
        $set: { file_url: [...prev_file, ...castArray(file_url)] },
        $push: { history: history },
      };

      const result = await adModel.findOneAndUpdate(filter, update, {
        projection: { file_url: 1 },
      });
      return result;
    }
  }

  /** добаление фото к рекламе adm   */
  async addAdPhoto(id:string, photo_url: Express.Multer.File[], history:History) {
    const data = await adModel.findOne({ _id: id }, { photo_url: 1, _id: 0 });
    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_photo = data?.photo_url;
    const filter = { _id: id };
    const update = {
      $set: { photo_url: [...prev_photo, ...photo_url] },
      $push: { history: history },
    };

    const result = await adModel.findOneAndUpdate(filter, update, {
      projection: { photo_url: 1 },
    });
    return result;
  }

  /**
   * добаление фото preview_url к рекламе adm
   */
  async addAdPhotoPreview(id: string, preview_url: Express.Multer.File[], history:History) {
    const data = await adModel.findOne({ _id: id }, { preview_url: 1, _id: 0 });
    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_photo = data?.preview_url;
    const filter = { _id: id };
    const update = {
      $set: { preview_url: [...prev_photo, ...preview_url] },
      $push: { history: history },
    };

    const result = await adModel.findOneAndUpdate(filter, update, {
      projection: { preview_url: 1 },
    });
    return result;
  }

  /** обновление "текстовых данных рекламмы" */
  async updateAdDetails(
    id: string,
    user_id: string,
    title: string,
    description: string,
    url: string,
    top_place: string,
    side_place: string,
    card_place: string,
    card_text: string,
    overlay: string,
    enabled: boolean,
    history:History,
  ) {     

    const filter = { _id: id };
    const update = {
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
      $push: { history: history },
    };
    const result = await adModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /**
   * получаем всю рекламму
   */
  async getAllAd() {
    const result = await adModel.find().sort({ _id: -1 });
    // console.log('AD GET >>> ', result);
    return result;
  }

  /**
   * получить заказ ро его ID adm
   */
  async getAdToId(id: string) {
    const result = await adModel.findById(id);
    return result;
  }

  /**
   * изменяем значения в БД по рекламме
   */
  async changeValuesZakaz(update:any, filter: any) {
    const result = await adModel.findByIdAndUpdate(filter, update);
    return result;
  }
  
  /** удаляем рекламму  */
  async deleteAd(id: string) {
    const result = await adModel.findByIdAndDelete(id);
    return result;
  }

}
export const adService = new AdService();