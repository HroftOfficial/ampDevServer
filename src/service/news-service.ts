const newsModel = require('../models/news.model');
import { config } from '../config/config';
import { History } from '../interfaces/User';
import { allService } from './all-service';



class NewsService {
  /** изменяем значения в БД пользователь портала   */
  async changeValuesNews(update: any, filter: any) {
    const result = await newsModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /** получить все новости   */
  async getAllNews() {
    const result = await newsModel.find().sort({ _id: -1 });
    return result;
  }

  /** получить вновость по id   */
  async getNewsToId(id: string) {
    const result = await newsModel.findById(id);
    return result;
  }

  /**создать новость   */
  async create(
    title: string,
    details: string,
    enabled: boolean,
    history: History,
    images: {
      [fieldname: string]: Express.Multer.File[];
    },
  ) {
    // console.log("news foto", images.images)
    const result = await newsModel.create({
      title,
      details,
      enabled,
      history,
      news_url: images.images,
    });
    return result;
  }

  /** обновить новость   */
  async update(id: string, title: string, details: string, history: History) {
    const filter = { _id: id };
    const update = { title, details, $push: { history: history } };
    const result = await newsModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /**смнеа фотографии в новости   */
  async changeImage(id: string, images: any, history: History) {
    if (!images) {
      return null;
    }
    const data = await newsModel.findById(id);

    if (!!data?.news_url[0]) {
      const deleteImg = data?.logo__img?.[0]?.path;
      await allService.unlinkFile(deleteImg);
    }

    const jName = images?.images?.[0]?.filename;
    const filePath = './public/uploads/' + config?.DESTINATION_NEWS + '/';
    const fileDest = './public/uploads/' + config?.DESTINATION_NEWS + '/';
    await allService.photoResizeAsync(jName, filePath, fileDest);

    const filter = { _id: id };
    // const update = { news_url: images, $push: { history: history } };
    const update = { news_url: images.images, $push: { history: history } };
    const result = await newsModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /**изменение даты новости   */
  async changeDate(id: string, date: any, history: History) {
    const filter = { _id: id };
    const update = { date, $push: { history: history } };
    const result = await newsModel.findByIdAndUpdate(filter, update);
    return result;
  }

  async getAllNewsLimit(
    offset: number,
    limit: number,
    enabled: boolean,
    deleted: boolean,
    service: boolean,
  ) {
    const news = await newsModel
      .find({
        enabled: enabled,
        deleted: deleted,
        service: service,
      })
      .sort({ date: -1, _id: -1 })
      .skip(offset)
      .limit(limit);
    return news;
  }

  //   getAllDataNewsLimit
  async getAllDataNewsLimit(offset: number, limit: number) {
    const data = await newsModel
      .find(
        {
          enabled: true,
        },
        {
          img: 1,
          date: 1,
          title: 1,
          news_url: 1,
        },
      )
      .sort({ date: -1, _id: -1 })
      .skip(offset)
      .limit(limit);
    const count = await newsModel
      .find({
        enabled: true,
      })
      .countDocuments();
    return {
      data,
      count,
    };
  }

  async getCountDoc(enabled: boolean, deleted: boolean, service: boolean) {
    const countDoc = await newsModel.countDocuments({
      enabled: enabled,
      deleted: deleted,
      service: service,
    });
    return countDoc;
  }

  /**удаляем новость   */
  async deleteNews(id: string) {
    const result = await newsModel.findByIdAndDelete(id);
    return result;
  }
}
export const newsService = new NewsService();