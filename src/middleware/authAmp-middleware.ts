import { Request, Response, NextFunction } from 'express';
import ApiError from '../exertions/api-error';
import { tokenAmpService } from '../service/tokenAmp-service';


export function authAmpMiddleware(req:Request, res:Response, next:NextFunction) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return next(ApiError.UnauthorizedError());
  }

  const accessToken = authorizationHeader.split(' ')[1];
  const userData = tokenAmpService.validateAccessToken(accessToken);
  if (accessToken && userData) {
    req.user = userData;
    return next();
  }
  return next(ApiError.UnauthorizedError());
}