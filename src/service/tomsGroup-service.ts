import { tomsGroupModel } from '../models/tomsGroup.model';

class TomsGroupService {
    
  async getTomsGroup() {
    const result = await tomsGroupModel.find();
    return result;
  }

  async getTomsGroupFromId(id: string) {
    const result = await tomsGroupModel.findById(id);
    return result;
  }

  async updateTomsGroup(name_rus: string, name_eng: string, id: string) {
    const filter = { _id: id };
    const update = { name_rus, name_eng };
    const result = await tomsGroupModel.findByIdAndUpdate(filter, update);
    return result;
  }

  async createTomsGroup(name_rus: string, name_eng: string) {
    const result = await tomsGroupModel.create({ name_rus, name_eng });
    return result;
  }

  /**удаление или восстановление группы обработки     */
  async deleteToms(id: string, enabled: string, deleted: boolean) {
    const filter = { _id: id };
    const update = { enabled, deleted };
    const result = await tomsGroupModel.findByIdAndUpdate(filter, update);
    return result;
  }
}
export const tomsGroupService = new TomsGroupService();
