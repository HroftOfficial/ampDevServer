import { Request, Response, NextFunction } from 'express';
import { newsService } from '../service/news-service';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';
import { config } from '../config/config';

class NewsController {

  /** активировать - деактивировать пользователя портала adm   */
  async changeState(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации change state news',
          ),
        );
      }
      const { id } = req.params;
      const { enabled } = req.body;
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'активировать Новость',
      };
      const checkNews = await newsService.getNewsToId(id);
      if (!checkNews) {
        return next(ApiError.NotFound());
      }
      const filter = { _id: id };
      const  update = { enabled, $push: { history: history } };

      const newsData = await newsService.changeValuesNews(
        update,
        filter,
      );
      return res.json(newsData);
    } catch (error) {
      next(error);
    }
  }


  /**получить все новости   */
  async getNews(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(получение новостей)',
          ),
        );
      }
      const newsData = await newsService.getAllNews();
      return res.json(newsData);
    } catch (error) {
      next(error);
    }
  }

  /**получить новость по id   */
  async getNewsId(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(получение новости)',
          ),
        );
      }
      const { id } = req.params;
      const newsData = await newsService.getNewsToId(id);
      // console.log('news detail', newsData);
      return res.json(newsData);
    } catch (error) {
      next(error);
    }
  }

  /** создание новости   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('news create');
      const errors = validationResult(req);
      const nameUser = req?.user?.name;
      const idUser = req?.user?._id;
      if (!nameUser || !idUser) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: idUser,
        messages: 'создание новости',
      };
      const { title, details, enabled } = req.body;
      // const images = req?.file;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const images = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (title === '' || details === '') {
        return next(
          ApiError.BadRequest(
            'Недостаточно данных для создания новости',
          ),
        );
      }
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const userData = await newsService.create(
        title,
        details,
        enabled,
        history,
        images,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**update новость по id   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const nameUser = req?.user?.name;
      const idUser = req?.user?._id;
      if (!nameUser || !idUser) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: idUser,
        messages: 'обноление новости',
      };
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(обновление новости)',
          ),
        );
      }
      const { id } = req.params;
      const { title, details } = req.body;
      const news = await newsService.update(id, title, details, history);
      return res.json(news);
    } catch (error) {
      next(error);
    }
  }

  /**удаление */
  async deleteNews(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации удаление новости'));
      }
      const { id } = req.params;
      const userData = await newsService.deleteNews(id);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** смена фото   */
  async changeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const nameUser = req?.user?.name;
      const idUser = req?.user?._id;
      if (!nameUser || !idUser) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: idUser,
        messages: 'смена фото новости',
      };
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(создание новости)',
          ),
        );
      }
      const { id } = req.params;
      const images = req.files;
      const userData = await newsService.changeImage(id, images, history);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** смена даты   */
  async changeDate(req: Request, res: Response, next: NextFunction) {
    try {
      const nameUser = req?.user?.name;
      const idUser = req?.user?._id;
      if (!nameUser || !idUser) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: idUser,
        messages: 'смена даты новости',
      };
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(смены даты новости)',
          ),
        );
      }
      const { id } = req.params;
      const { date } = req.body;
      // console.log('route change date', id, date);
      const userDate = await newsService.changeDate(id, date, history);
      return res.json(userDate);
    } catch (error) {
      next(error);
    }
  }


  /** получить новости постранично */
  async getNewsLimit(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации получение новостей потранично'),
        );
      }
      const { page = '1', limit = config?.NEWS_LIMIT } = req?.params;
      const offset = parseInt(limit) * parseInt(page) - parseInt(limit);

      const allDataNewsLimit = await newsService.getAllDataNewsLimit(offset, parseInt(limit));
      res.set('x-total-news', allDataNewsLimit?.count);

      return res.json(allDataNewsLimit?.data);
    } catch (error) {
      next(error);
    }
  }
}

export const newsController = new NewsController();

// module.exports = new NewsController();
