import { mainPlantApModel } from '../models/mainPlant.model';
import { allService } from './all-service';
import { config } from '../config/config';
import { History } from '../interfaces/User';

class MainPlantGroupApService {
  /**new code */
  //get main plant group
  async getPlants() {
    const result = await mainPlantApModel.find().sort({ sortNumber: 1 });
    return result;
  }

  //create main plant group
  async createPlant(
    name: string,
    sortNumber: number,
    enabled: boolean,
    images: {
      [fieldname: string]: Express.Multer.File[];
    },
  ) {
    const plant = await mainPlantApModel.create({
      name,
      sortNumber,
      enabled,
      images,
    });
    return plant;
  }

  /** смена логотипа группы оборудования из админки */
  async changeImage(
    id: string,
    history: History,
    images: any,
  ) {
    if (!images) {
      return null;
    }
    const data = await mainPlantApModel.findOne({ _id: id });
    if (data?.images) {
      const deletePath = data?.images?.[0]?.path;
      allService.unlinkFile(deletePath);
    }

    const jName = images.filename;
    const filePath = './public/uploads/' + config?.DESTINATION_PLANT_MAIN_AP + '/';
    const fileDest = './public/uploads/' + config?.DESTINATION_PLANT_MAIN_AP + '/';
    await allService.photoResizeAsync(jName, filePath, fileDest);
    const filter = { _id: id };
    const update = { images, $push: { history: history } };
    const result = await mainPlantApModel.findByIdAndUpdate(filter, update);
    return result;
  }

  //get main plant grout to ID
  async getPlantFromId(id: string) {
    // const plantData = await mainPlantApModel.findById(id);
    const plantData = await mainPlantApModel.findOne({ _id: id });
    return plantData;
  }
  /**new code */

  async updatePlantAll(id: string, name: string, sortNumber: number, enabled: boolean) {
    const result = await mainPlantApModel.findOneAndUpdate(
      { _id:id },
      { name, sortNumber, enabled },
    );

    return result;
  }

}

export const mainPlantGroupApService = new MainPlantGroupApService();
// module.exports = new MainPlantGroupApService();
