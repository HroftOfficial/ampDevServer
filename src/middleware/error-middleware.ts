// const ApiError = require('../exertions/api-error');
import ApiError from '../exertions/api-error';
import { Request, Response } from 'express';

// module.exports = function (err:ApiError, req: Request, res:Response) {
export function errorMiddleware(err:ApiError, req: Request, res:Response) {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: `непредвиденная ошибка ${err}` });
}