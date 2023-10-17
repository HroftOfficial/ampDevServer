import { Request, Response, NextFunction } from 'express';
import { userServiceAmp } from '../service/userAmp-service';
import { validationResult } from 'express-validator';
import ApiError from '../exertions/api-error';
import { config } from '../config/config';

class UserControllerAmp {
  /**
	 * ADM block start
	 */

  /** смена пароля пользователя портала в админке */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации смена пароля полльзователя портала',
            
          ),
        );
      }
      const { id } = req.params;
      const { email } = req.body;
      const userId = req.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'обновление пароля пользователя',
      };
      const userData = await userServiceAmp.changePassword(id, email, history);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**
	 * получить данные пользователя портала для админки
	 */
  async getUserIdToAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации получение данных пользователя',
            
          ),
        );
      }
      const { id } = req.params;
      const userData = await userServiceAmp.getUserIdToAdmin(id);
      console.log('==============', userData);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**
	 * ADM block end
	 */

  /** изменение данных пользователя в одном месте */
  async updateUserPortal(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при обновление данных пользователя и логотипа по его ID',
            
          ),
        );
      }
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'обновление данных пользователя и логотипа',
      };

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { description, tag, html__href } = req?.body;
      // const { logo__img } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const logo__img = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (!logo__img) {
        await userServiceAmp.updateUsersLogo(userId, logo__img, history);
      }
      // console.log("<<update user body>> ", req?.body," <<>> ",req?.files);
      await userServiceAmp.updateUsersDetailsClient(
        userId,
        description,
        tag,
        html__href,
        history,
      );
      return res.status(200).send({ message: 'данные пользователя обновлены' });
    } catch (error) {
      next(error);
    }
  }

  /**
	 * изменить виды мех обработки которые может делать пользователь по его ID kl
	 */
  async updateMehToIdClient(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при изменение видов мех обработки пользователя по его ID',
            
          ),
        );
      }
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages:
					'изменить виды мех обработки которые может делать пользователь',
      };
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { work_category = '5f51fda156a0c50b1a44c69c' } = req?.body;
      // console.log('body', req.body, req.user);
      const userData = await userServiceAmp.updateMehToIdClient(
        userId,
        work_category,
        history,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }


  /** обнорвление logo пользователя по его ID kl */
  async updateUserLogo(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при обнорвлении логотипа пользователя по его ID',
            
          ),
        );
      }
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'обновление логотипа пользователя',
      };
      // const { logo__img } = req.files;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      // const logo__img = req.files as {
      //   [fieldname: string]: Express.Multer.File[];
      // };
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const logo__img = req.files as Express.Multer.File[];
      const userData = await userServiceAmp.updateUsersLogo(
        userId,
        logo__img,
        history,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**
	 * поиск пользователей по мидам мех обработки
	 */
  async findUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при поиске пользователей по видам мех обработки',
            
          ),
        );
      }
      const { query, category } = req?.body;
      const { page = '1', limit = config?.PARTNER_LIMIT } = req?.params;
      const offset = parseInt(limit) * parseInt(page) - parseInt(limit);
      if (query == '' && category?.length === 0) {
        // console.log('all');
        const noQueryData = await userServiceAmp.getPartners(
          offset,
          parseInt(limit),
          true,
          false,
          false,
        );
        res.set('x-total-partners', noQueryData?.count.toString());
        const dataUser = noQueryData?.data;
        return res.json(dataUser);
        // return res.json(noQueryData?.data);
      }

      if (query == '' && category?.length > 0) {
        const userDataCategory = await userServiceAmp.findUsersCategory(
          category,
          offset,
          parseInt(limit),
        );
        res.set('x-total-partners', userDataCategory?.count.toString());
        const dataUser = userDataCategory?.data;
        return res.json(dataUser);
      }

      if (!(query == '') && category?.length === 0) {
        const userDataQuery = await userServiceAmp.findUsersQuery(
          query,
          offset,
          parseInt(limit),
        );
        res.set('x-total-partners', userDataQuery?.count.toString());
        const dataUser = userDataQuery?.data;
        return res.json(dataUser);
      }
      const userData = await userServiceAmp.findUsers(
        query,
        category,
        offset,
        parseInt(limit),
      );
      res.set('x-total-partners', userData?.count.toString());
      const dataUser = userData?.data;
      return res.json(dataUser);
    } catch (error) {
      next(error);
    }
  }

  /**
	 * получить данные пользователя по его ID для kl
	 */
  async getUserPortalDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }
      const { id } = req.params;
      // const { _id } = req?.user;
      const userData = await userServiceAmp.getUserFromId(id);
      if (!userData) {
        return next(ApiError.NotFound());
      }
      // console.log('details user amp', userData);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** список work_categoty по пользователям*/
  async getfindUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await userServiceAmp.getFindUsers();
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** создание нового пользователя портала. Генерация пароля, Отсылка учетных данных на почту"   */
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      const nameUser = req?.user?.name;
      const idUser = req?.user?._id;
      if (!nameUser || !idUser) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: idUser,
        messages: 'регистрация пользователя портала',
      };

      const {
        name,
        email,
        org,
        raiting,
        legend,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        html__href,
        inn,
        ogrn,
        information,
        description,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_access_level = ['0'],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        work_category = ['5f51fda156a0c50b1a44c69c'],
        cities,
        service,
      } = req.body;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { logo__img } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (email === '' || name === '' || org === '') {
        return next(
          ApiError.BadRequest(
            'Недостаточно данных для регистрации пользователя',
            
          ),
        );
      }
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }

      if (!logo__img) {
        return null;
      }
      const userData = await userServiceAmp.registration(
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
        cities,
        history,
        logo__img,
        service,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**update пользователя портала. " */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при изменение данных пользователя портала (админка)',
            
          ),
        );
      }
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      if ( !userId && !nameUser) {
        return null;
      }
      if (!nameUser || !userId) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: userId,
        messages: 'изменение данных пользователя портала (админка)',
      };
      const { id } = req.params;
      const {
        name,
        email,
        org,
        raiting,
        legend,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        html__href,
        inn,
        ogrn,
        information,
        description,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_access_level = ['0'],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        work_category = ['5f51fda156a0c50b1a44c69c'],
      } = req.body;
      if (email === '' || name === '' || org === '') {
        return next(
          ApiError.BadRequest(
            'Недостаточно данных для обновления пользователя',
            
          ),
        );
      }
      const userData = await userServiceAmp.update(
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
        history,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** смена логотипа "  */
  async changeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      const nameUser = req?.user?.name;
      const idUser = req?.user?._id;
      if (!nameUser || !idUser) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const history = {
        name: nameUser,
        id: idUser,
        messages: 'смена аватара',
      };

      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { logo__img } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      


      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации логотип' ),
        );
      }

      if (!logo__img) {
        return null;
      }
      const userImage = await userServiceAmp.changeImage(id, history, logo__img);
      return res.json(userImage);
    } catch (error) {
      next(error);
    }
  }

  async getUsersNoLimit(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }
      const users = await userServiceAmp.getAllUsersNoLimit();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getInhereUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(получение владельцев заказа)',
            
          ),
        );
      }
      const users = await userServiceAmp.getInhereUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getPartners(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }
      const { page = '1', limit = config?.PARTNER_LIMIT } = req.params;
      const offset = parseInt(limit) * parseInt(page) - parseInt(limit);
      const partners = await userServiceAmp.getPartners(
        offset,
        parseInt(limit),
        true,
        false,
        false,
      );

      res.set('x-total-partners', partners?.count.toString());
      // console.log(">>>>", partners.data)
      return res.json(partners?.data);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      // console.log(req.body);
      const userData = await userServiceAmp.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 2592000000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userServiceAmp.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userServiceAmp.refresh(refreshToken);
      // console.log('users amp refresh >>', userData);
      if (!userData) {return null;}
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 2592000000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const { page = '1', limit = config?.PARTNER_LIMIT } = req.params;
      const countDoc = await userServiceAmp.getCountDoc();
      res.set('x-total-news', countDoc.toString());

      const offset = parseInt(limit) * parseInt(page) - parseInt(limit);

      const users = await userServiceAmp.getAllUsers(offset, parseInt(limit));
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }
      //    const {id} = req.params;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const id = req.user?._id;
      if (!id) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const userData = await userServiceAmp.getUserFromId(id);
      if (!userData) {
        return next(ApiError.NotFound());
      }
      // console.log('details user amp', userData);
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUserDetailsToken(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации получить пользователя по pyload',
            
          ),
        );
      }
      const { id = req.user?._id } = req.params;
      // console.log('getUserDetailsToken',id, req.user._id)
      if (!id) {
        return res.status(500).json({
          messsage: 'не коректный ID',
        });
      }
      const userData = await userServiceAmp.getUserFromIdClient(id);
      if (!userData) {
        return next(ApiError.NotFound());
      }
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getToms(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }
      // console.log('get tom s route');
      const data = await userServiceAmp.getToms();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  	//getTomsUnwind
  async getTomsUnwind(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации'),
        );
      }
      const data = await userServiceAmp.getTomsUnwind();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async changeCities(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('change cities route');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации смены населенного пункта',
            
          ),
        );
      }
      const { id } = req.params;
      const { cities } = req.body;
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      if (userId && nameUser) {
        const history = {
          name: nameUser,
          id: userId,
          messages: 'активировать пользователя',
        };
        // console.log('route contorller new cities', cities);
        if (!cities) {
          return null;
        }
        const userData = await userServiceAmp.changeCities(id, cities, history);
        return res.json(userData);
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('update password routing');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации' ),
        );
      }
      const { id } = req.params;
      const { password } = req.body;
      const userData = await userServiceAmp.updatePassword(password, id);
      // userData = null
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** main активировать - деактивировать пользователя портала adm  */
  async changeState(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации change state',
            
          ),
        );
      }
      const { id } = req.params;
      const { enabled } = req.body;
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      const history = {
        name: nameUser,
        id: userId,
        messages: 'активировать пользователя',
      };
      const checkUserPortal = await userServiceAmp.getUserFromId(id);
      if (!checkUserPortal) {
        return next(ApiError.NotFound());
      }
      const filter = { _id: id };
      let update = {};
      if (enabled) {
        update = { deleted: false, enabled, $push: { history: history } };
      } else {
        update = { enabled, $push: { history: history } };
      }
      const userData = await userServiceAmp.changeValuesUserPortal(
        update,
        filter,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /** пометка на удаление пользователя портала adm */
  async deleteUserPortal(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(удаление пользователя)',
            
          ),
        );
      }
      const { id } = req.params;
      const { deleted } = req.body;
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      const history = {
        name: nameUser,
        id: userId,
        messages: 'удаление пользователя портала',
      };

      const checkUserPortal = await userServiceAmp.getUserFromId(id);
      if (!checkUserPortal) {
        return next(ApiError.NotFound());
      }
      const filter = { _id: id };
      let update = {};
      if (deleted) {
        update = { deleted, enabled: false, $push: { history: history } };
      } else {
        update = { deleted, $push: { history: history } };
      }
      const userData = await userServiceAmp.changeValuesUserPortal(
        update,
        filter,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  /**сделать(или убрать) службным пользователя портала */
  async stateServiceUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            'Ошибка при валидации(служебный пользователь)',
            
          ),
        );
      }
      const { id } = req.params;
      const { service } = req.body;
      const userId = req?.user?._id;
      const nameUser = req?.user?.name;
      const history = {
        name: nameUser,
        id: userId,
        messages: 'служебный пользователь',
      };
      const checkUserPortal = await userServiceAmp.getUserFromId(id);
      if (!checkUserPortal) {
        return next(ApiError.NotFound());
      }
      const filter = { _id: id };
      const update = { service, $push: { history: history } };
      const userData = await userServiceAmp.changeValuesUserPortal(
        update,
        filter,
      );
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async changePasswordLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await userServiceAmp.sendEmailToChangePassword(email);
      return res.status(200).json({
        message:
					'Вам должно прийти письмо с отправителем info@copartner.ru. Проверьте ваш почтовый ящик',
      });
    } catch (error) {
      next(error);
    }
  }

  async newPasswordUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, password } = req.body;
      await userServiceAmp.newPasswordUrl(id, password);
      return res.status(200).json({
        message: 'пароль изменен',
      });
    } catch (error) {
      next(error);
    }
  }

  //newPasswordProfile
  async newPasswordProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      const id = req.user?._id;
      if (!id) {
        return res.status(500).json({
          message: 'не верный ID',
        });
      }
      await userServiceAmp.newPasswordProfile(id, password);
      return res.status(200).json({
        message: 'пароль изменен',
      });
    } catch (error) {
      next(error);
    }
  }

  async changeExtendedSort(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { extended_sorting } = req.body;
      const result = await userServiceAmp.changeExtendedSort(
        id,
        extended_sorting,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateLastVisitUser(req: Request, res: Response, next: NextFunction)  {
    try {
      // console.log('route ulv');
      const id = req.user?._id;
      if (!id) { return null;}
      const result = await userServiceAmp.ulv(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  /**end main*/

}
const userControllerAmp = new UserControllerAmp();
export { userControllerAmp };
