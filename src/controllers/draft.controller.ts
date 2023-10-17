import { Request, Response, NextFunction } from 'express';
import { draftService } from '../service/draft-service';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';
import { config } from '../config/config';

class DraftController {
  async getDrafted(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      let draftData = {
        count: 0,
        data: {},
      };
      // console.log(' get all draft route >> ');
      const {
        category,
        currentPage,
        filters,
        search,
        limit = config?.DRAFT_LIMIT,
      } = req.body?.data;
      const page = currentPage;
      const q = search;
      const v = category;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req.user?._id;
      if (!user_id) {return  null;}
      const offset = limit * page - limit;
      // console.log(' get all draft >> ',  filters, offset,  parseInt(limit),  user_id);
      if (filters?.length > 0) {
        // console.log('filter');
        draftData = await draftService.getFilterDraft(
          filters,
          offset,
          parseInt(limit),
          user_id,
        );
      } else {
        draftData = await draftService.getAllDraft(
          offset,
          parseInt(limit),
          q,
          v,
          user_id,
        );
        // console.log('no filter', draftData);
      }       
      res.set('x-total-draft', draftData?.count.toString());
      const draft = draftData?.data;
      return res.json(draft);
    } catch (error) {
      next(error);
    }
  }

  async getDraftDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req.user?._id;
      if (!user_id) { return null; }
      const draftData = await draftService.getDraftFromId(
        id,
        true,
        false,
        user_id,
      );
      if (!draftData) {
        return next(ApiError.NotFound());
      }
      return res.json(draftData);
    } catch (error) {
      next(error);
    }
  }

  async getDraftedFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации фильтр группы обработки',
          ),
        );
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { id_group, page = '1', limit = '12' } = req?.params;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req.user?._id;
      if (!user_id) { return null; }
      const enabled = true;
      const deleted = false;
      const offset = parseInt(limit) * parseInt(page) - parseInt(limit);
      const dataDraft = await draftService.getDraftFilterAll(
        id_group,
        enabled,
        deleted,
        user_id,
        offset,
        parseInt(limit),
      );
      res.set('x-total-draft', dataDraft?.count.toString());
      const draftDataFilter = dataDraft?.data;
      if (!draftDataFilter) {
        return next(ApiError.NotFound());
      }
      return res.json(draftDataFilter);
    } catch (error) {
      next(error);
    }
  }

  // async getDraftFind(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { q } = req.query;
  //     const keys = ['first_name', 'last_name', 'email'];
  //     const search = (data: any) => {
  //       return data.filter((item: any) =>
  //         keys.some((key: any) => item[key].toLowerCase().includes(q)),
  //       );
  //     };
  //     const dataFind = await draftService.getDataFind();
  //     if (q) {
  //       return res.json(search(dataFind));
  //     } else {
  //       return res.json(dataFind);
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  /**
   * автопоиск по payload user_id
   */
  async getDraftAutoFind(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации автоматический подбор заказов',
          ),
        );
      }
      // id пользователя
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req.user?._id;
      if (!user_id) { return null; }
      const { currentPage = 1, limit = config?.DRAFT_LIMIT } = req?.body;
      const offset = limit * currentPage - limit;
      // console.log('auto find', user_id, currentPage, limit);
      const dataDraft = await draftService.getDraftFilterAutoFind(
        user_id,
        offset,
        parseInt(limit),
      );
      res.set('x-total-draft', dataDraft?.count.toString());
      const draftDataAutoFind = dataDraft?.data;
      if (!draftDataAutoFind) {
        return next(ApiError.NotFound());
      }
      return res.json(draftDataAutoFind);
    } catch (error) {
      next(error);
    }
  }

  async getMehData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации виды мех. обработки',
          ),
        );
      }
      const mehData = await draftService.getMehData();
      // console.log(mehData)
      return res.json(mehData);
    } catch (error) {
      next(error);
    }
  }

  async sendZvk(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации отправка сообщения о заявке',
          ),
        );
      }
      const { textValue, url } = req?.body;
      // const { uploadFile } = req?.files;\
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { uploadFile } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      // console.log( req?.files, req?.body)
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const user_id = req?.user?._id;
      if (!user_id) { return null; }
      const data = await draftService.sendZvk(
        textValue,
        url,
        user_id,
        uploadFile,
      );
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * отдаем данные пользователю по переходу с телеграмм по ID заказа kl
   */
  async getTelegramDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации телеграм ссылка',
          ),
        );
      }
      const { id } = req.params;
      const userData = await draftService.getTelegram(id);
      // console.log('userdata', userData);
      if (!userData) {
        return next(ApiError.NotFound());
      }
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}
export const draftController = new DraftController();
// module.exports = new DraftController();
