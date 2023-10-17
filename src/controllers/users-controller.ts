import { Request, Response, NextFunction } from 'express';
import { userService } from '../service/user-service';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';

const LIMIT_ITEMS = process.env.LIMIT_ITEMS || '12';

class UserController {
    
  async login(req:Request, res:Response, next:NextFunction) {
    try {
      const { email, password } = req?.body;
      const userData = await userService.login(email, password);
      // console.log('userData controllers login', userData);
      // console.log('cookie token administartor login>>>', userData.refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 2592000000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req:Request, res:Response, next:NextFunction) {
    try {
      const { refreshToken } = req?.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req:Request, res:Response, next:NextFunction) {
    try {
      const { refreshToken } = req?.cookies;
      // console.log('cookie token administartor client>>>', refreshToken);
      const userData = await userService.refresh(refreshToken);
      // if (typeof(userData) === null) {return null;}
      // console.log('cookie token administartor db>>>', userData.refreshToken, '>>>>', userData?.accessToken);
      if (!!userData) {
        res.cookie('refreshToken', userData.refreshToken, {
          maxAge: 2592000000,
          httpOnly: true,
        });
        return res.status(200).json(userData);
      }
      return res.status(401);
    } catch (error) {
      next(error);
    }
  }

  async registration(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      const { email, password, position, name, enabled } = req.body;
      if (email === '' || password === '' || name === '') {
        return next(
          ApiError.BadRequest(
            'Недостаточно данных для регистрации пользователя',
          ),
        );
      }
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const userData = await userService.registration(
        email,
        password,
        position,
        name,
        enabled,
      );
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsersNoLimit(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const users = await userService.getAllUsersNoLimit();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { page = '1', limit = LIMIT_ITEMS  } = req.params;
      // const { page, limit } = req.params;

      // if (page < 0) page = 1;
      // if (limit < 0) limit = parseInt(process.env.LIMIT_ITEMS);
      // limit = parseInt( LIMIT_ITEMS );

      const countDoc = await userService.getCountDoc();
      res.set('x-total-news', countDoc.toString());

      const offset = parseInt(limit) * parseInt(page) - parseInt(limit);

      const users = await userService.getAllUsers(
        offset,
        parseInt(limit),
      );
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { id } = req.params;
      const userData = await userService.getUserFromId(id);
      if (!userData) {
        return next(ApiError.NotFound());
      }
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updateUsers(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { id } = req.params;
      const { name, email, position, enabled } = req.body;
      const userData = await userService.update(
        name,
        email,
        position,
        enabled,
        id,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { id } = req.params;
      const { password } = req.body;
      const userData = await userService.updatePassword(password, id);
      // userData = null
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**удаление пользователя*/
  async deleteUsers(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации удаление admin'));
      }
      const { id } = req.params;
      const countAdmin = await userService.getCountAdmin();
      if (countAdmin == 1) {
        return next(ApiError.BadRequest('Остался 1 администратор. Его не удаляю!!!'));
      }
      const userData = await userService.deleteAdmin(id);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** активировать - деактивировать пользователя adm */
  async changeState(req:Request, res:Response, next:NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации change state'));
      }
      const { id } = req.params;
      const { state } = req.body;
      const userData = await userService.getUserFromId(id);
      if (!userData) {
        return next(ApiError.NotFound());
      }
      userData.enabled = state;
      userData.save();
      return res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
export { userController };
// module.exports = new UserController();
