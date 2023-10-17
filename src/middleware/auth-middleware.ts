import { Request, Response, NextFunction } from 'express';
import ApiError from '../exertions/api-error';
// const ApiError = require('../exertions/api-error');
// const tokenService = require('../service/token-service');
import { tokenService } from '../service/token-service';

interface IUser {
  name:string;
  email:string;
  password:string;
  enabled:boolean;
  position:string;
}
// export interface IGetUserAuthInfoRequest extends Request {
//   user: IUser
// }
// export function authMiddleware(req:Request, res:Response, next:NextFunction) {
//   try {
//     const authorizationHeader = req.headers.authorization;
//     if (!authorizationHeader) {
//       return next(ApiError.UnauthorizedError());
//     }
//     const accessToken = authorizationHeader.split(' ')[1];
//     if (!accessToken) {
//       return next(ApiError.UnauthorizedError());
//     }
//     const userData = tokenService.validateAccessToken(accessToken);

//     if (!userData) {
//       return next(ApiError.UnauthorizedError());
//     }
//     if (accessToken && userData) {
//       req.user = userData;
//       return next();
//     }
//     // req.user = userData;
//     // next();
//   } catch (error) {
//     return next(ApiError.UnauthorizedError());
//   }
// };


export function authMiddleware(req:Request, res:Response, next:NextFunction) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return next(ApiError.UnauthorizedError());
  }

  const accessToken = authorizationHeader.split(' ')[1];
  const userData = tokenService.validateAccessToken(accessToken);
  if (accessToken && userData) {
    req.user = userData;
    return next();
  }
  return next(ApiError.UnauthorizedError());
}
