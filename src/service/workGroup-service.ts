import { Group as workGroupModel } from '../models/workGroup.model';

class WorkGroupService {
  async getWorkGroup() {
    const workGroup = await workGroupModel.find().sort({ 'access_level':1 });
    return workGroup;
  }

  async createWorkGroup(name: string, raiting: number, legend: string) {
    const result =  await workGroupModel.create({ name, raiting, legend });
    return result;
  }

  /** удалить или восстановить группу предприятий adm */
  async getWorkGroupFromId(id: string) {
    const workGroupItem = await workGroupModel.findById(id);
    return workGroupItem;
  }


}
export const workGroupService = new WorkGroupService();