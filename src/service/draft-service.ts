import { Zakaz as zakazModel } from '../models/zakaz.model';
import { userModelAmp } from '../models/userAmp.model';
import { tomsModel } from '../models/toms.model';
import { mehTypesModels as mechModel } from '../models/mechtype.model';
import { Types } from 'mongoose';
import { mailService } from './mail-service';
import { allService } from './all-service';
class DraftService {
  /**
   * получить данные заказа для страницы телеграм
   */
  async getTelegram(id: string) {
    // console.log('id', id)
    return zakazModel.findById(id, {
      telegram_url: 1,
      title: 1,
      work_info: 1,
      kl: 1,
      kl_text: 1,
      cities: 1,
      details: 1,
    });
  }

  async getFilterDraft(filters: string[], offset:number, limit:number, user_id: string) {
    // console.log('getFilterDraft service >>', filters, offset, limit, user_id);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await allService.getAccessLevelToId(user_id);
    // console.log("filter access level", access_level);
    const dataReturn = await zakazModel.aggregate([
      {
        $match: {
          // work_category: { $ne: "" },
          enabled: true,
          deleted: false,
          // zakaz_access_level: { $in: access_level.user_access_level },
          zakaz_access_level: { $in: access_level },
          work_category: { $in: filters },
        },
      },
    ]);

    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);
    // console.log(' getFilterDraft ', count, data);
    return {
      count,
      data,
    };
  }

  async getAllDraft(offset: number, limit: number, q: string, v: string, user_id: string) {
    const groupValuesMap = new Map();
    groupValuesMap.set('102', '604f1cb24b2ca10006d44415');
    groupValuesMap.set('103', '604f1d2e4b2ca10006d4441d');
    groupValuesMap.set('104', '604f1d494b2ca10006d4441f');
    groupValuesMap.set('105', '604f1cd14b2ca10006d44417');
    groupValuesMap.set('106', '604f1cee4b2ca10006d44419');
    groupValuesMap.set('107', '604f1d0f4b2ca10006d4441b');
    groupValuesMap.set('108', '604f1d614b2ca10006d44421');
    groupValuesMap.set('109', '604f1c954b2ca10006d44413');

    const val = groupValuesMap.get(v) || '604f1c954b2ca10006d44413';
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await allService.getAccessLevelToId(user_id);
    const dataMech = await mechModel.aggregate([
      { $match: { _id: new Types.ObjectId(val) } },
      {
        $project: {
          item: { $concatArrays: ['$items.id_name'] },
        },
      },
    ]);
    // console.log('getAllDraft service >>', val, access_level, dataMech);
    if (v == '101' && q == '') {
      const dataReturn = await zakazModel.aggregate([
        {
          $match: {
            $and: [
              { enabled: true },
              { deleted: false },
              // { zakaz_access_level: { $in: access_level.user_access_level } },
              { zakaz_access_level: { $in: access_level } },
            ],
          },
        },
        {
          $project: {
            number: 1,
            title: 1,
            photo_url: 1,
            index_photo: 1,
            details: 1,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      const count = dataReturn?.length;
      const data = dataReturn?.slice(offset, offset + limit);
      return {
        count,
        data,
      };
    }

    if (v == '101' && q !== '') {
      const dataReturn = await zakazModel.aggregate([
        {
          $addFields: {
            numbStr: {
              $toString: '$number',
            },
          },
        },
        {
          $match: {
            $and: [
              { enabled: true },
              { deleted: false },
              // { zakaz_access_level: { $in: access_level.user_access_level } },
              { zakaz_access_level: { $in: access_level } },
              {
                $or: [
                  { title: { $regex: q, $options: 'i' } },
                  { cities: { $regex: q, $options: 'i' } },
                  { numbStr: { $regex: q, $options: 'i' } },
                ],
              },
            ],
          },
        },
        {
          $project: {
            number: 1,
            title: 1,
            photo_url: 1,
            index_photo: 1,
            details: 1,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      const count = dataReturn?.length;
      const data = dataReturn?.slice(offset, offset + limit);
      return {
        count,
        data,
      };
    }

    if (v !== '101' && q == '') {
      const dataReturn = await zakazModel.aggregate([
        {
          $addFields: {
            numbStr: {
              $toString: '$number',
            },
          },
        },
        {
          $match: {
            $and: [
              { enabled: true },
              { deleted: false },
              // { zakaz_access_level: { $in: access_level.user_access_level } },
              { zakaz_access_level: { $in: access_level } },
              { work_category: { $in: dataMech[0]?.item } },
            ],
          },
        },
        {
          $project: {
            number: 1,
            title: 1,
            photo_url: 1,
            index_photo: 1,
            details: 1,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      const count = dataReturn?.length;
      const data = dataReturn?.slice(offset, offset + limit);
      // console.log(' getAllDraft ', count, data);
      return {
        count,
        data,
      };
    }

    if (v !== '101' && q !== '') {
      const dataReturn = await zakazModel.aggregate([
        {
          $addFields: {
            numbStr: {
              $toString: '$number',
            },
          },
        },
        {
          $match: {
            $and: [
              { enabled: true },
              { deleted: false },
              // { zakaz_access_level: { $in: access_level.user_access_level } },
              { zakaz_access_level: { $in: access_level } },
              { work_category: { $in: dataMech[0]?.item } },
              {
                $or: [
                  { title: { $regex: q, $options: 'i' } },
                  { cities: { $regex: q, $options: 'i' } },
                  { numbStr: { $regex: q, $options: 'i' } },
                ],
              },
            ],
          },
        },
        {
          $project: {
            number: 1,
            title: 1,
            photo_url: 1,
            index_photo: 1,
            details: 1,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      const count = dataReturn?.length;
      const data = dataReturn?.slice(offset, offset + limit);
      return {
        count,
        data,
      };
    }

    return {
      count: 0,
      data: {},
    };
  }

  //получить виды мех. обработки
  async getMehData() {
    return zakazModel.aggregate([
      { $match: { work_category: { $ne: '' }, enabled: true, deleted: false } },
      { $project: { work_info: 1 } },
      { $unwind: '$work_info' },
      { $group: { _id: '$work_info', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  async getCountDoc(enabled: boolean, deleted: boolean, user_id:string) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await userModelAmp.findById(user_id);
    if (!access_level) { return null; }
    const countDoc = await zakazModel.countDocuments({
      enabled: enabled,
      deleted: deleted,
      access_level: { $in: access_level.user_access_level },
    });
    return countDoc;
  }

  async getCountDocFilter( enabled: boolean, deleted: boolean, user_id: string) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await userModelAmp.findById(user_id);
    if (!access_level) { return null; }
    const countDoc = await zakazModel.countDocuments({
      enabled: enabled,
      deleted: deleted,
      access_level: { $in: access_level.user_access_level },
    });
    return countDoc;
  }

  async getDraftFromId(id: string, enabled:boolean, deleted:boolean, user_id: string) {
    // console.log('user ID getDraftFromId >>', user_id)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await allService.getAccessLevelToId(user_id);
    if (!access_level) { return null; }
    const arrayAccess = access_level;
    const service = await allService.getServicesToId(id);
    // const access_level = await userModelAmp.findById(user_id);
    const draftData = await zakazModel.findOne({
      _id: id,
      enabled: enabled,
      deleted: deleted,
      zakaz_access_level: { $in: arrayAccess },
    });
    return { data: draftData, service: service };
  }

  async getDraftFilter(id_group: string, user_id: string) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await userModelAmp.findById(user_id);
    if (!access_level) { return null; }
    const draftDataFilter = await zakazModel.aggregate([
      {
        $match: {
          zakaz_access_level: { $in: access_level.user_access_level },
        },
      },
      { $addFields: { idGroup: id_group } },

    ]);
    return draftDataFilter;
  }

  async getDraftFilterAutoFind(user_id: string, offset: number, limit:number) {
    const userData = await userModelAmp.findById(user_id);

    if (!userData) {
      return {
        count: 0,
        data: [],
      };
    }

    const dataReturn = await zakazModel.find({
      zakaz_access_level: { $in: userData.user_access_level },
      enabled: true,
      deleted: false,
      work_category: { $in: userData.work_category },
    });

    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);

    return {
      count,
      data,
    };
  }

  async getDraftFilterAll(id_group: string, enabled: boolean, deleted:boolean, user_id:string, offset: number, limit:number) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await userModelAmp.findById(user_id);
    const arrayOfGroup = await tomsModel.find({ tomsgroup_key: id_group });
    const arrayOfGroupFinal = arrayOfGroup.map((a: any) => a?.id_name);
    if (!access_level || arrayOfGroupFinal.length == 0) {
      return null;
    }
    const allDataOne = await zakazModel
      .find({
        zakaz_access_level: { $in: access_level.user_access_level },
        enabled: enabled,
        deleted: deleted,
        work_category: { $in: arrayOfGroupFinal },
      })
      .sort({ date: 1 })
      .skip(offset)
      .limit(limit);

    const countDataOne = await zakazModel
      .find({
        zakaz_access_level: { $in: access_level.user_access_level },
        enabled: enabled,
        deleted: deleted,
        work_category: { $in: arrayOfGroupFinal },
      })
      .countDocuments();

    return {
      count: countDataOne,
      data: allDataOne,
    };
    // return allData;
  }

  async sendZvk(textValue: string, url:string, user_id:string, uploadFile:any) {
    const info = await userModelAmp.findById(user_id);
    if (!info) { return null;}
    const username = info?.name;
    const org = info?.org;
    const email = info?.email;
    const msg = textValue;
    const mailTheme = 'Для вас новое сообщение';

    return mailService.sendZvkMail(
      username,
      org,
      email,
      msg,
      mailTheme,
      url,
      uploadFile,
    );
  }
}

export const draftService = new DraftService();
