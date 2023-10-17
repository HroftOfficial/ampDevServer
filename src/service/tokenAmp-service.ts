import { sign, verify } from 'jsonwebtoken';
import { User } from '../types';
const tokenAmpModel = require('../models/tokenAmp.model');
const userModelAmp = require('../models/userAmp.model');
const { config } = require('../config/config');

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = config;


class TokenAmpService {

  generateTokens(payload: string | object) {
    const accessToken = sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m' });//30c
    const refreshToken = sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token:string) {
    try {
      const userData = verify(token, JWT_ACCESS_SECRET);
      // console.log('access token amp validate', token)
      return userData as User;
    } catch (error) {
      console.log('access token amp no valid');
      return null;
    }
  }

  validateRefreshToken(token:string) {
    try {
      const userData = verify(token, JWT_REFRESH_SECRET);
      return userData ;
    } catch (error) {
      // console.log('refresh token no valid')
      return null;
    }
  }

  async saveToken(userId: string, refreshToken:string) {
    const tokenData = await tokenAmpModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenAmpModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken:string) {
    const tokenData = await tokenAmpModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken:string) {
    const tokenData = await tokenAmpModel.findOne({ refreshToken });
    return tokenData;
  }

  async getAccessGroupUser(userId:string) {
    try {
      const accessGroup = await userModelAmp.findById(userId);
      return accessGroup;
    } catch (error) {
      return null;
    }
  }

}
export const tokenAmpService = new TokenAmpService();
