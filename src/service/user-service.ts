import { userModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { tokenService } from './token-service';
const UserDto = require('../dtos/user-dto');
import ApiError from '../exertions/api-error';


class UserService {

  /**Login administrator   */
  async login(email:string, password:string) {
    const user = await userModel.findOne({ email });
    // console.log('find user admin login >>>', user);
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }
    const userEnabled = await userModel.findOne({ email }, { enabled:1, _id:0 });
    if (!userEnabled?.enabled) {
      throw ApiError.BadRequest('Пользователь не активирован или находится в блокировке');
    }
    const isPasswordEquals = await bcrypt.compare(password, user?.password);
    if (!isPasswordEquals) {
      throw ApiError.BadRequest('Не верный пароль');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  /** Logout administartor  */
  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  /**Refresh administartor     */
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }
    if (typeof(userData) == 'string') {
      return null;
    }
    const user = await userModel.findById(userData._id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async registration(email: string, password: string, position: string, name:string, enabled: boolean) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({ email, password: hashPassword, position, name, enabled });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async update(name: string, email: string, position: string, enabled: boolean, id: string) {
    console.log(id);
    const filter = { _id:id };
    const update = { name, email, position, enabled };
    const result = await userModel.findByIdAndUpdate(filter, update);
    return result;

  }

  async updatePassword(password: string, id: string) {
    console.log(id, password);
    const filter = { _id:id };
    const hashPassword = await bcrypt.hash(password, 12);
    const update = { password: hashPassword };
    const result = await userModel.findByIdAndUpdate(filter, update);
    return result;
  }

  async getAllUsers(offset:number, limit: number) {        
    const users = await userModel.find({})
      .sort({ date: -1, _id: -1 })
      .skip(offset)
      .limit(limit);
    return users;
  }

  async getAllUsersNoLimit() {
    const users = await userModel.find()
      .sort({ _id: -1 });
    return users;
  }

  async getCountDoc() {
    const countDoc = await userModel.countDocuments({});
    return countDoc;
  }

  async getUserFromId(id: string) {
    const userData = await userModel.findById(id);
    return userData;
  }

  /** проверяем количество администраторов */
  async getCountAdmin() {
    const result = await userModel.count();
    return result;
  }

  /** удаляем  */
  async deleteAdmin(id: string) {
    const result = await userModel.findByIdAndDelete(id);
    return result;
  }
}

export const userService = new UserService();