import { sign, verify } from 'jsonwebtoken';
import { tokenModel } from '../models/token.model';
import { config } from '../config/config';
import { User } from '../types';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = config;

class TokenService {
  generateTokens(payload: string | object) {
    const accessToken = sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30d' });//30c
    const refreshToken = sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });//30d
    return {
      accessToken,
      refreshToken,
    };
  } 

  validateAccessToken(token: string) {
    try {
      const userData = verify(token, JWT_ACCESS_SECRET);
      return userData as User;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = verify(token, JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

const tokenService = new TokenService();
export { tokenService };