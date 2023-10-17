// eslint-disable-next-line import/no-extraneous-dependencies
import password_gen from 'secure-random-password';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mehTypesModels as Meh_type } from '../models/mechtype.model';
import { Zakaz as zakazModel } from '../models/zakaz.model';
import { userModelAmp } from '../models/userAmp.model';
import fs from 'fs';
import sharp from 'sharp';


export class AllService {
  async getBigWorkCategory(id_category: string) {
    const result = await Meh_type.aggregate([
      { $unwind: '$items' },
      { $addFields: { id_work: '$items.id_name' } },
      { $project: { _id: 0, name_key: 1, id_work: 1 } },
      { $match: { id_work: id_category } },
    ]);
    return result;
  }

  async getRandomPassword() {
    const password = await password_gen.randomPassword({
      length: 12,
      characters: [password_gen.lower, password_gen.upper, password_gen.digits],
    });

    return password;
  }

  async photoResizeAsync(
    jName: string,
    filePath: string,
    fileDest: string,
    resize: number = 500,
  ) {
    try {
      const inputPath = filePath + jName;
      const outputPath = fileDest + jName;
      await sharp(inputPath)
        .resize(resize) // Установите желаемые размеры ширины и высоты
        .toFile(outputPath);

      console.log('Изображение успешно уменьшено и сохранено.');
    } catch (err) {
      if (err instanceof Error) {
        console.log({ message: err.message });
      } else {
        console.log({ message: `непредвиденная ошибка ${err}` });
      }
      console.log('Error processing image:', err);
    }
  }

  //=========== Image and files upload ======//

  async checkId(id: string) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return id;
    } else {
      return null;
    }
  }

  async unlinkFile(options: fs.PathLike) {
    if (!options) {
      return null;
    }
    fs.access(options, fs.constants.F_OK | fs.constants.W_OK, (err: any) => {
      if (err) {
        if (err instanceof Error) {
          console.log({ message: err.message });
        } else {
          console.log({ message: `непредвиденная ошибка ${err}` });
        }
      } else {
        fs.unlink(options, () => {});
      }
    });
  }

  /** получаем work_info по work_category */
  async getWorkInfo(work_category: string) {
    // console.log("work_category", work_category)
    try {
      //5f51fda156a0c50b1a44c697
      const dataName = await Meh_type.aggregate([
        { $unwind: '$items' },
        {
          $project: {
            'items.id_name': 1,
            'items.name': 1,
            _id: 0,
          },
        },
        { $match: { 'items.id_name': work_category } },
      ]);
      if (!dataName) return NaN;
      const workInfo = {
        id: dataName[0].items.id_name,
        name: dataName[0].items.name,
      };
      return workInfo;
      // return data_name
    } catch (err) {
      if (err instanceof Error) {
        console.log({ message: err.message });
      } else {
        console.log({ message: `непредвиденная ошибка ${err}` });
      }
    }
  }

  /** получаем work_info по work_category для пользователей  */
  async getWorkInfoToUsers(work_category: string[], count: number) {
    // console.log("work_category", work_category)
    try {
      //5f51fda156a0c50b1a44c697
      const dataName = await Meh_type.aggregate([
        { $unwind: '$items' },
        {
          $project: {
            'items.id_name': 1,
            'items.name': 1,
            _id: 0,
          },
        },
        { $match: { 'items.id_name': work_category } },
      ]);
      if (!dataName) return NaN;
      const workInfo = {
        id: dataName[0].items.id_name,
        name: dataName[0].items.name,
        count: count,
      };
      return workInfo;
      // return data_name
    } catch (err) {
      if (err instanceof Error) {
        console.log({ message: err.message });
      } else {
        console.log({ message: `непредвиденная ошибка ${err}` });
      }
    }
  }

  /**получаем имя владельца заказа по его id */
  async getNameInhereUser(inhere_user: string) {
    try {
      // console.log('inhere_user', inhere_user);
      if (!inhere_user) {
        return null;
      }
      const result = await zakazModel.findById(inhere_user, { org: 1, _id: 0 });
      return result;
    } catch (err) {
      if (err instanceof Error) {
        console.log({ message: err.message });
      } else {
        console.log({ message: `непредвиденная ошибка ${err}` });
      }
    }
  }

  /**получить массив access_level по ID пользователя */
  async getAccessLevelToId(userId: string) {
    if (!!userId) {
      // console.log('getAccessLevelToId >>', userId);
      // const data = await userModelAmp.findById(userId);
      const data = await userModelAmp.findOne({ _id: userId });
      // console.log('getAccessLevelToId2 >>', data);
      return data?.user_access_level;
    } else {
      return ['0'];
    }
  }

  /**получить массив services по ID пользователя */
  async getServicesToId(id: string) {
    const userId = await zakazModel.findById(id);
    const data = await userModelAmp.findById(userId?.inhere_user);
    // console.log(user_id?.inhere_user, data.service)
    if (!data) {
      return null;
    }
    return {
      service: data?.service,
      raiting: data?.raiting,
      legend: data?.legend,
    };
  }
}

export const allService = new AllService();
