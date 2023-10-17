import { userModelAmp } from '../models/userAmp.model';
import { mehTypesModels } from '../models/mechtype.model';
import bcrypt from 'bcrypt';
import { mailService } from './mail-service';
import { tokenAmpService } from './tokenAmp-service';
const UserDtoAmp = require('../dtos/user-dto-amp');
import ApiError from '../exertions/api-error';
import { unlink } from 'fs';
import { config } from '../config/config';
import { allService } from './all-service';
const uuid = require('uuid');
const castArray = (value: any) => (Array.isArray(value) ? value : [value]); //???

import { History } from '../interfaces/User';

const { CLIENT_URL } = config;

class UserServiceAmp {
  /** ADM block start*/

  /**смена пароля пользователя портала админки*/
  async changePassword(id: string, email: string, history: History) {
    const filter = { _id: id };
    const password = await allService.getRandomPassword();
    const hashPassword = await bcrypt.hash(password, 12);
    const update = { password: hashPassword, $push: { history: history } };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    if (!result) {
      return null;
    }
    await mailService.sendChangePasswordMail(email, password);
    // await mailService.sendChangePasswordMail("sagdinov.a@yandex.ru", password);
    return result;
  }

  /** получить данные пользователя портала для админки */
  async getUserIdToAdmin(id: string) {
    if (!id) {
      return null;
    }
    const result = await userModelAmp.findById(id);
    return result;
  }

  /**ADM block end  */

  /** изменить виды мех обработки которые может делать пользователь по его ID kl*/
  async updateMehToIdClient(
    user_id: string,
    work_category: string[],
    history: History,
  ) {
    const result = [];
    for (const key in work_category) {
      if (Object.hasOwnProperty.call(work_category, key)) {
        const element = work_category[key];
        const name = await allService.getWorkInfo(element);
        result.push(name);
      }
    }
    const filter = { _id: user_id };
    const update = {
      work_category: work_category,
      work_info: result,
      $push: { history: history },
    };
    const res = await userModelAmp.findByIdAndUpdate(filter, update);
    return res;
  }

  /**изменить "текстовые" данные пользователя по его ID kl */
  async updateUsersDetailsClient(
    user_id: string,
    description: string,
    tag: string,
    html__href: string,
    history: History,
  ) {
    const filter = { _id: user_id };
    const update = {
      description,
      html__href,
      tag,
      $push: { history: history },
    };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  /** изменить logo пользователя по его ID kl   */
  async updateUsersLogo(user_id: string, logo__img: Express.Multer.File[], history: History) {
    if (!logo__img) {
      return null;
    }
    const data = await userModelAmp.findById(user_id);
    if (data?.logo__img[0]) {
      unlink(data?.logo__img[0]?.path, () => {});
    }
    const filter = { _id: user_id };
    const update = { logo__img: logo__img, $push: { history: history } };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  async changeImage(
    id: string,
    history: History,
    logo__img:Express.Multer.File[],
  ) {
    if (!logo__img) {
      return null;
    }
    const data = await userModelAmp.findById(id);

    if (!!data?.logo__img[0]) {
      const deleteLogo = data?.logo__img?.[0]?.path;
      await allService.unlinkFile(deleteLogo);
    }

    const jName = logo__img?.[0]?.filename;
    const filePath = './public/uploads/' + config?.DESTINATION_USER_AMP + '/';
    const fileDest = './public/uploads/' + config?.DESTINATION_USER_AMP + '/';
    await allService.photoResizeAsync(jName, filePath, fileDest);

    const filter = { _id: id };
    const update = { logo__img: logo__img, $push: { history: history } };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  /*** удаление или восстановление пользователя*/
  async deleteUser(id: string, enabled: boolean, deleted: boolean) {
    const filter = { _id: id };
    const update = { enabled, deleted };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  /*** делаем или удаляем из служебных пользователя */
  async stateServiceUser(id: string, service: boolean) {
    const filter = { _id: id };
    const update = { service };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  /**получить все виды мех. обработки */
  async getToms() {
    const toms = await mehTypesModels.find();
    // console.log(' get toms >>', toms);
    return toms;
  }

  	//getTomsUnwind
  async getTomsUnwind() {
    const toms = await mehTypesModels.aggregate([
      { $unwind: { path: '$items' } },
    ]);
    return toms;
  }

  async registration(
    name: string,
    email: string,
    org: string,
    raiting: number,
    legend: string,
    html__href: string,
    inn: number,
    ogrn: number,
    information: string,
    description: string,
    user_access_level: string[],
    work_category: string[],
    cities: string,
    history: History,
    logo__img: Express.Multer.File[],
    service: string,
  ) {
    const candidate = await userModelAmp.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`,
      );
    }
    const password = await allService.getRandomPassword();
    const hashPassword = await bcrypt.hash(password, 12);
    const workInfo = [];
    for (const key in work_category) {
      if (Object.hasOwnProperty.call(work_category, key)) {
        const element = work_category[key];
        const result = await allService.getWorkInfo(element);
        workInfo.push(result);
      }
    }
    const userAmp = await userModelAmp.create({
      name,
      email,
      org,
      raiting,
      legend,
      password: hashPassword,
      html__href,
      inn,
      ogrn,
      information,
      description,
      user_access_level,
      work_category,
      work_info: workInfo,
      cities,
      history,
      logo__img,
      service,
    });
    if (service == 'false') {
      await mailService.sendPasswordMail(email, password);
    }
    // await mailService.sendPasswordMail(email, password);
    // await mailService.sendPasswordMail("sagdinov.a@yandex.ru", password);
    return userAmp;
  }

  async changeCities(id: string, cities: string, history: History) {
    const filter = { _id: id };
    const update = { cities: cities, $push: { history: history } };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  async update(
    id: string,
    name: string,
    email: string,
    org: string,
    raiting: number,
    legend: string,
    html__href: string,
    inn: number,
    ogrn: number,
    information: string,
    description: string,
    user_access_level: string[],
    work_category: string[],
    history: History,
  ) {
    const workInfo = [];
    for (const key in work_category) {
      if (Object.hasOwnProperty.call(work_category, key)) {
        const element = work_category[key];
        const result = await allService.getWorkInfo(element);
        workInfo.push(result);
      }
    }
    const filter = { _id: id };
    const update = {
      id,
      name,
      email,
      org,
      raiting,
      legend,
      html__href,
      inn,
      ogrn,
      information,
      description,
      user_access_level,
      work_category,
      work_info: workInfo,
      $push: { history: history },
    };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  async updatePassword(password: string, id: string) {
    const filter = { _id: id };
    const hashPassword = await bcrypt.hash(password, 12);
    const update = { password: hashPassword };
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  async login(email: string, password: string) {
    const user = await userModelAmp.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }
    const userEnabled = await userModelAmp.findOne(
      { email },
      { enabled: 1, _id: 0 },
    );
    if (!userEnabled?.enabled) {
      throw ApiError.BadRequest(
        'Пользователь не активирован или находится в блокировке',
      );
    }
    const isPasswordEquals = await bcrypt.compare(password, user?.password);
    if (!isPasswordEquals) {
      throw ApiError.BadRequest('Не верный пароль');
    }
    const userDtoAmp = new UserDtoAmp(user);
    console.log('userDtoAmp ', userDtoAmp);
    const tokens = tokenAmpService.generateTokens({ ...userDtoAmp });

    await tokenAmpService.saveToken(userDtoAmp._id, tokens.refreshToken);

    return { ...tokens, user: userDtoAmp };
  }

  async logout(refreshToken: string) {
    const token = await tokenAmpService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenAmpService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenAmpService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }
    if (typeof(userData) == 'string') {
      return null;
    }
    const user = await userModelAmp.findById(userData?._id);
    const userDtoAMP = new UserDtoAmp(user);
    const tokens = tokenAmpService.generateTokens({ ...userDtoAMP });

    await tokenAmpService.saveToken(userDtoAMP._id, tokens.refreshToken);

    return { ...tokens, user: userDtoAMP };
  }

  async getAllUsers(offset: number, limit: number) {
    // console.log(offset, limit);
    const users = await userModelAmp
      .find({})
      .sort({ date: -1, _id: -1 })
      .skip(offset)
      .limit(limit);
    return users;
  }

  async getAllUsersNoLimit() {
    const users = await userModelAmp
      .find()
      .sort({ _id: -1, extended_sorting: -1 });
    // console.log(users)
    return users;
  }

  async getInhereUsers() {
    const users = await userModelAmp
      .find({ enabled: true, deleted: false })
      .sort({ _id: -1 });
    return users;
  }

  async getCountDoc() {
    const countDoc = await userModelAmp.countDocuments({});
    return countDoc;
  }

  async getCountDocPartners(
    enabled: boolean,
    deleted: boolean,
    service: boolean,
  ) {
    const countDoc = await userModelAmp.countDocuments({
      enabled: enabled,
      deleted: deleted,
      service: service,
    });
    return countDoc;
  }

  async getPartners(
    offset: number,
    limit: number,
    enabled: boolean,
    deleted: boolean,
    service: boolean,
  ) {
    const dataReturn = await userModelAmp
      .find(
        {
          enabled: enabled,
          deleted: deleted,
          service: service,
        },
        {
          name: 1,
          org: 1,
          logo__img: 1,
          cities: 1,
          html__href: 1,
          work_category: 1,
          description: 1,
        },
      )
      .sort({ extended_sorting: 1, _id: -1 });
    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);
    return {
      count,
      data,
    };
  }

  async getUserFromId(id: string) {
    // const userData = await userModelAmp.findById(id);
    const userData = await userModelAmp.findOne({ _id:id });
    return userData;
  }

  async getUserFromIdClient(user_id: string) {
    const userData = await userModelAmp.findById(user_id, {
      password: 0,
      deleted: 0,
      enabled: 0,
      date: 0,
      person_data: 0,
      user_access_level: 0,
      write_access_level: 0,
      __v: 0,
      raiting: 0,
      service: 0,
      legend: 0,
      history: 0,
    });
    return userData;
  }

  /** ищем пользователей по мех обработке   */
  async findUsers(query: string, category: string, offset: number, limit: number) {
    const tagQuery = castArray(query);
    const dataReturn = await userModelAmp.aggregate([
      {
        $match: {
          $and: [
            { enabled: true },
            { deleted: false },
            { service: false },
            { work_category: { $in: category } },
            {
              $or: [
                { tag: { $in: tagQuery } },
                { cities: { $regex: query, $options: ' i ' } },
                { org: { $regex: query, $options: ' i ' } },
              ],
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          org: 1,
          logo__img: 1,
          cities: 1,
          html__href: 1,
          work_category: 1,
          work_info: 1,
          description: 1,
          tag: 1,
        },
      },
      { $sort: { _id: -1 } },
    ]);
    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);
    return {
      count,
      data,
    };
  }

  /** ищем пользователей по мех обработке(только query)*/
  async findUsersQuery(query: string, offset: number, limit: number) {
    const tagQuery = castArray(query);
    const dataReturn = await userModelAmp.aggregate([
      {
        $match: {
          enabled: true,
          deleted: false,
          service: false,
          $or: [
            { tag: { $in: tagQuery } },
            { cities: { $regex: query, $options: 'i' } },
            { org: { $regex: query, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          name: 1,
          org: 1,
          logo__img: 1,
          cities: 1,
          html__href: 1,
          work_category: 1,
          work_info: 1,
          description: 1,
          tag: 1,
        },
      },
      { $sort: { _id: -1 } },
    ]);
    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);
    return {
      count,
      data,
    };
  }

  /** ищем пользователей по мех обработке(только категории)*/
  async findUsersCategory(category: string, offset: number, limit: number) {
    const dataReturn = await userModelAmp.aggregate([
      {
        $match: {
          enabled: true,
          deleted: false,
          service: false,
          work_category: { $in: category },
        },
      },
      {
        $project: {
          name: 1,
          org: 1,
          logo__img: 1,
          cities: 1,
          html__href: 1,
          work_category: 1,
          work_info: 1,
          description: 1,
          tag: 1,
        },
      },
      { $sort: { _id: -1 } },
    ]);
    const count = dataReturn?.length;
    const data = dataReturn?.slice(offset, offset + limit);
    return {
      count,
      data,
    };
  }

  /** список видов мех обрабоки по пользователям */
  async getFindUsers() {
    const prepareResult = await userModelAmp.aggregate([
      { $match: { work_category: { $ne: '' }, enabled: true, deleted: false } },
      { $project: { work_info: 1 } },
      { $unwind: '$work_info' },
      { $group: { _id: '$work_info', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return prepareResult;
  }

  async sendEmailToChangePassword(email: string) {
    const uuidUrl = uuid.v4();
    await userModelAmp.updateMany({ email }, { changePasswordHashed: uuidUrl });
    const url = `${CLIENT_URL}/change_password/${uuidUrl}`;
    console.log(email, url);
    await mailService.sendChangePasswordUrlMail(email, url);
  }

  async newPasswordUrl(id: string, password: string) {
    //ищем есть ли пользователем с таким хешем
    const candidate = await userModelAmp.findOne({ changePasswordHashed: id });
    if (!candidate) {
      throw ApiError.BadRequest('Пользователь для изменения пароля не найден');
    }
    const email = candidate?.email;
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await userModelAmp.findOneAndUpdate(
      { changePasswordHashed: id },
      { password: hashPassword, changePasswordHashed: null },
    );
    await mailService.sendChangePasswordMail(email, password);
    return result;
  }

  async newPasswordProfile(id: string, password: string) {
    //ищем есть ли пользователем с таким хешем
    const candidate = await userModelAmp.findOne({ _id: id });
    if (!candidate) {
      throw ApiError.BadRequest('Пользователь для изменения пароля не найден');
    }
    const email = candidate?.email;
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await userModelAmp.findOneAndUpdate(
      { _id: id },
      { password: hashPassword },
    );
    await mailService.sendChangePasswordMail(email, password);
    return result;
  }

  async changeExtendedSort(id: string, extended_sorting: string) {
    const filter = { _id: id };
    const update = { extended_sorting };
    const result = await userModelAmp.findOneAndUpdate(filter, update);
    return result;
  }

  /**изменяем значения в БД пользователь портала*/
  async changeValuesUserPortal(update: any, filter: any) {
    const result = await userModelAmp.findByIdAndUpdate(filter, update);
    return result;
  }

  async ulv(id: string) {
    return userModelAmp.findOneAndUpdate({ _id: id }, { lastVisit: new Date() });
  }
  
}
export const userServiceAmp = new UserServiceAmp();
