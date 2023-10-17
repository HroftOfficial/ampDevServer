// const tomsModel = require('../models/toms.model');
import { tomsModel } from '../models/toms.model';

class TomsService {

  /** получить все виды мех. обработки */
  async getToms() {
    const toms = await tomsModel.aggregate([
      {
        $lookup:{
          'from': 'tomsgroups',
          localField: 'tomsgroup_key',
          foreignField: '_id',
          as: 'out' },
      },
      { $sort:{ sortNumber: 1 } },
    ]);
    return toms;
  }

  /**удаление или восстановление вида мех. обработки */
  async deleteToms(id: string, enabled: boolean, deleted: boolean) {
    const filter = { _id:id };
    const update = { enabled, deleted };
    const result = await tomsModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /** усоздание вида мех. обработки  */
  async createToms(name: string, group: string, enabled: boolean) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const tomsgroup_key = group;
    const result = await tomsModel.create({ name, tomsgroup_key, enabled });
    return result;
  }

  /**получить вид обработки по ID     */
  async getTomsFromId(id: string) {
    const tomsItem = await tomsModel.findById(id);
    return tomsItem;
  }

}
export const tomsService = new TomsService();