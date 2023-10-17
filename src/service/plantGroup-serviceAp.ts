import { groupPlantModelAp } from '../models/groupPlant.modelAp';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class PlantGroupApService {
  /**new code */
  /**удалить или восстановить группу оборудования adm*/
  async getPlantGroupFromId(id: string) {
    const result = await groupPlantModelAp.findOne({ _id: id });
    return result;
  }

  //create plant group
  async createPlant(name: string, enabled: boolean, plantGroupAp: string) {
    const plant = await groupPlantModelAp.create({
      name,
      enabled,
      plantGroupAp,
    });
    return plant;
  }

  //get plant group
  async getPlants() {
    const result = await groupPlantModelAp.aggregate([
      { $addFields: { lookupId: { $toObjectId: '$plantGroupAp' } } },
      {
        $lookup: {
          from: 'mainplantaps',
          // localField: 'plantGroupAp',
          localField: 'lookupId',
          foreignField: '_id',
          as: 'out',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          mainName: '$out.name',
          mainId: '$out._id',
          enabled: 1,
        },
      },
    ]);
    return result;
  }

  //get plant group to ID
  async getPlantFromId(id: string) {
    const result = await groupPlantModelAp.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $addFields: { lookupId: { $toObjectId: '$plantGroupAp' } } },
      {
        $lookup: {
          from: 'mainplantaps',
          localField: 'lookupId',
          // localField: 'plantGroupAp',
          foreignField: '_id',
          as: 'out',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          mainName: { $arrayElemAt: ['$out.name', 0] },
          mainId: { $arrayElemAt: ['$out._id', 0] },
          enabled: 1,
        },
      },
    ]);
    return result;
  }

  async deletePlantGroup(id:string, enabled: boolean) {
    const result = await groupPlantModelAp.findOneAndUpdate(
      { _id:id }, { enabled },
    );
    return result;
  }

  async savePlantGroup(
    id: string,
    name: string,
    plantGroupAp: string,
    enabled: boolean,
  ) {
    const filter = { _id: id };
    const update = { name, plantGroupAp, enabled };
    const result = await groupPlantModelAp.findOneAndUpdate(filter, update);
    return result;
  }

  /**new code */

  async updatePlant(name: string, sortNumber: number, enabled: boolean, id: string) {
    console.log(id);
    const filter = { _id: id };
    const update = { name, sortNumber, enabled };
    const result = await groupPlantModelAp.findByIdAndUpdate(filter, update);
    return result;
  }  
}
export const plantGroupServiceAp = new PlantGroupApService();
