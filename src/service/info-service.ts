import { userModelAmp } from '../models/userAmp.model';
import { Zakaz as zakazModel } from '../models/zakaz.model';
import { mailService } from './mail-service';

class InfoService {
  /** Send registration form */
  async sendZvk(username: string, org: string, email: string, tel: string, msg: string, mailTheme: string) {
    const result = await mailService.sendFeedbackMail(
      username,
      org,
      email,
      tel,
      msg,
      mailTheme,
    );
    return result;
  }

  async getInfo() {
    const category = await zakazModel.aggregate([
      {
        $match: {
          work_category: { $ne: '' },
        },
      },
      { $unwind: '$work_info' },
      { $group: { _id: '$work_info', count: { $sum: 1 } } },
      { $project: { '_id.name': 1, count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const allUser = await userModelAmp.count({
      enabled: true,
      deleted: false,
      service: false,
    });
    const allZakaz = await zakazModel.count();

    const obj = {
      allUser,
      allZakaz:allZakaz + 3532,
      category,
    };
    return obj;
  }

  async getFindInfo() {
    const result = await zakazModel.aggregate([
      { $match: { work_category: { $ne: '' }, enabled: true, deleted: false } },
      { $project: { work_info: 1 } },
      { $unwind: '$work_info' },
      { $group: { _id: '$work_info', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result;
  }
  
  async getZakazesInfoData(offset:number, limit: number, data: any, user_id: string) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const access_level = await userModelAmp.findById(user_id);
    if (access_level === null) { return null;}
    const dataReturn = await zakazModel.aggregate([
      {
        $match: {
          zakaz_access_level: { $in: access_level.user_access_level },
          enabled: true,
          deleted:false,
          work_category:{ $in: data },
        },
      },
      
    ]);

    const count = dataReturn?.length;
    const dataFind = dataReturn?.slice(offset, offset + limit);
    return {
      count,
      dataFind,
    };
  }
  
}
module.exports = new InfoService();
