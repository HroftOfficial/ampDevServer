import { History, MulterFileTypes } from '../interfaces/User';
import { PlantAp as  plantApModel } from '../models/plant.modelAp';
import { groupPlantModelAp as plantGroupModel } from '../models/groupPlant.modelAp';
import { userModelAmp } from '../models/userAmp.model';
import { allService } from './all-service';

type InhereUsers = {
  inhereUserId: string;
  inhereUserName: string;
};

const castArray = (value: any) => (Array.isArray(value) ? value : [value]);

const favoriteCardDto = {
  name: 1,
  info: 1,
  photo_plant: 1,
  index_photo: 1,
  number: 1,
};
const plantDetailsDto = {
  ...favoriteCardDto,
  newPlant: 1,
  price: 1,
  cities: 1,
  inhereUser: 1,
  file_plant: 1,
  plantGroup: 1,
};
class PlantApService {
  /**new code */

  async getPlants() {
    const plant = await plantApModel.aggregate([
      { $addFields: { lookupId: { $toObjectId: '$plantGroup' } } },
      {
        $lookup: {
          from: 'groupplantaps',
          // localField: "plantGroup",
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
          deleted: 1,
          inhereUser: 1,
          sortNumber: 1,
          plantGroup: 1,
          newPlant: 1,
          cities: 1,
          info: 1,
          history: 1,
          phot_plant: 1,
          file_plant: 1,
          price: 1,
        },
      },
      { $sort: { sortNumber: 1 } },
    ]);
    return plant;
  }

  async getPlantFromId(id: string) {
    const plantData = await plantApModel.findById(id, { ...plantDetailsDto });
    const groupPlant = plantData?.plantGroup?.toString();
    const mainGroup = await plantGroupModel.findById(groupPlant, {
      _id: 0,
      plantGroupAp: 1,
    });
    return { plantData, mainGroup };
  }

  async createPlant(
    name: string,
    sortNumber: number,
    newPlant: boolean,
    plantGroup: string,
    info: string,
    photo_plant: MulterFileTypes[],
    file_plant: MulterFileTypes[],
    inhereUser: InhereUsers,
    cities: string,
    price: string,
    index_photo: number,
    history: History,
    enabled: boolean = false,
    deleted: boolean = false,
  ) {
    const plant = await plantApModel.create({
      name,
      sortNumber,
      newPlant,
      plantGroup,
      info,
      photo_plant,
      file_plant,
      inhereUser,
      cities,
      price,
      index_photo,
      history,
      enabled,
      deleted,
    });
    return plant;
  }

  /**удаление файлов plant adm */
  async deletePlantFilesAdm(
    id: string,
    filename: string,
    path: string,
    history: History,
  ) {
    if (!filename) {
      return null;
    }

    await allService.unlinkFile(`${path}/${filename}`);
    await allService.unlinkFile(`${path}/thumb/${filename}`);

    const filter = { _id: id };
    const update = {
      $pull:{
        photo_plant: { filename: { $in: [filename] } } ,
        file_plant: { filename: { $in: [filename] } },
      },
      $push: { history: history },
    };
    await plantApModel.updateOne(filter, update);
    return { message: 'файлы удалены' };
  }

  async updatePlant(
    id: string,
    name: string,
    sortNumber: number,
    enabled: boolean,
    newPlant: boolean,
    plantGroup: string,
    info: string,
    inhereUser: InhereUsers,
    price: string,
    index_photo: number,
    // cities,
    history: History,
  ) {

    const result = await plantApModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        sortNumber,
        newPlant,
        plantGroup,
        info,
        inhereUser,
        price,
        index_photo,
        // cities,
        enabled: false,
        deleted: false,
        $set: { history },
      },
    );
    return result;
  }

  /**добаление фото к заказу adm   */

  async addPlantPhotoAdm(id: string, photo_plant: any, history: History) {
    const data = await plantApModel.findOne(
      { _id: id },
      { photo_plant: 1, _id: 0 },
    );
    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_photo = data?.photo_plant;
    if (!prev_photo) { return null; }
    const filter = { _id: id };
    const update = {
      $set: { photo_plant: [...prev_photo, ...photo_plant] },
      $push: { history: history },
    };
    console.log('data', update);

    const result = await plantApModel.findOneAndUpdate(filter, update, {
      projection: { photo_plant: 1 },
    });
    return result;
  }

  /**добаление файлов к заказу adm */
  async addPlantFilesAdm(id: string, file_plant: any, history: History) {
    const data = await plantApModel.findOne(
      { _id: id },
      { file_plant: 1, _id: 0 },
    );
    if (!data) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const prev_file = data?.file_plant;
    if (!prev_file) { return null;}
    // console.log('rest data file >>>>>>>>>', [...prev_file, ...file_url])
    const filter = { _id: id };
    const update = {
      $set: { file_plant: [...prev_file, ...file_plant] },
      $push: { history: history },
    };

    const result = await plantApModel.findOneAndUpdate(filter, update, {
      projection: { file_plant: 1 },
    });

    return result;
  }

  //change cities
  async changeCities(id: string, cities: string, history: History) {
    const filter = { _id: id };
    const update = { cities: cities, $push: { history: history } };
    const result = await plantApModel.findByIdAndUpdate(filter, update);
    return result;
  }

  /** получить историю */
  async getHistoryToId(id: string) {
    const result = await plantApModel.findOne(
      { _id: id },
      { history: 1, _id: 0 },
    );
    return result;
  }

  /**start favorite */
  async getFavoriteToId(userId: string) {
    const arrayFavorite = await userModelAmp.findOne(
      { _id: userId },
      { _id: 0, favorite: 1 },
    );
    // console.log(arrayFavorite?.favorite);

    if (arrayFavorite?.favorite && arrayFavorite?.favorite?.length < 1) return null;
    const data = await plantApModel.find(
      { _id: { $in: arrayFavorite?.favorite } },
      { ...favoriteCardDto },
    );
    return data;
  }

  /**add favorite */
  async addPlantFavorite(userId: string, favorite: string[]) {
    const filter = { _id: userId };
    const update = {
      $push: { favorite: favorite },
    };
    const result = await userModelAmp.findOneAndUpdate(filter, update);
    return result;
  }

  //delete favorite to User
  async deletePlantFavorite(userId: string, favorite: string[]) {
    const filter = { _id: userId };
    const update = {
      $pull: { favorite: favorite },
    };
    const result = await userModelAmp.findOneAndUpdate(filter, update);
    return result;
  }

  /**end favorite */
  //get plant profile
  async getPlantProfile(userId: string) {
    const result = await plantApModel.find(
      { 'inhereUser.inhereUserId': userId },
      { ...favoriteCardDto, enabled: 1, deleted: 1, price: 1, cities: 1 },
    );
    return result;
  }

  //get plant to Main group
  async getMainGroupPlant(mainGroup: string, offset: number, limit: number) {
    const groupPlant = await plantGroupModel.find(
      { plantGroupAp: mainGroup },
    );
    const array = [];
    for (const key in groupPlant) {
      if (Object.hasOwnProperty.call(groupPlant, key)) {
        const element = groupPlant[key];
        array.push(element?._id.toString());
      }
    }
    // console.log("get plant to Main group1", array);
    const dataReturn = await plantApModel.find({
      plantGroup: { $in: array },
      deleted: false,
      enabled: true,
    });
    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);
    return {
      count,
      data,
    };
  }

  async getPlantGroupPlant(plantGroups: string, offset: number, limit: number) {
    const arrData = castArray(plantGroups);
    console.log(arrData);
    const dataReturn = await plantApModel.find({
      plantGroup: { $in: arrData },
      deleted: false,
      enabled: true,
    });
    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);
    return {
      count,
      data,
    };
  }

  async deletePlantProfile(id: string) {
    const filter = { _id: id };
    const update = { enabled: false, deleted: true };
    const result = await plantApModel.findOneAndUpdate(filter, update);
    return result;
  }

  async unDeletePlantProfile(id: string) {
    const filter = { _id: id };
    const update = { enabled: false, deleted: false };
    const result = await plantApModel.findOneAndUpdate(filter, update);
    return result;
  }

  /**new code */


  // /**удаление или восстановление оборудование   */
  async deletePlant(id: any, enabled: any, deleted: any) {
    const filter = { _id: id };
    const update = { enabled, deleted };
    const result = await plantApModel.findByIdAndUpdate(filter, update, {
      returnOriginal: false });
    return result;
  }

}
export const plantApService = new PlantApService();
