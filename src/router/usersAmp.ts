import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { userControllerAmp } from '../controllers/users-controllerAmp';
import multer from 'multer';
import { config } from '../config/config';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import rateLimit, { MemoryStore } from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
		'С вашего IP адреса поступило много неверных сведений. Доступ к авторизации заблокирован на 15 минут.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  store: new MemoryStore(),
});

export const router = express.Router();

const storage = multer.diskStorage({
  destination: './public/uploads/' + config?.DESTINATION_USER_AMP,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    checkFileType(file, cb);
  },
});

const cpUpload = upload.fields([{ name: 'logo__img', maxCount: 1 }]);
// const cpUpload = upload.single('logo__img');

// Check File Type
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Такие файлы загружать не разрешено!'));
  }
}

/**
 * ADM
 * block start
 */

/**
 *  Регистрация пользователя adm
 */
router.post(
  '/registration',
  authMiddleware,
  cpUpload,
  userControllerAmp.registration,
);

/**
 * генерируем, меняем новый пароль и отсылаем его на почту
 */
router.post('/cp/:id', authMiddleware, userControllerAmp.changePassword);

/**получить информацию по пользователю*/
router.get(
  '/get_user_adm/:id',
  authMiddleware,
  userControllerAmp.getUserIdToAdmin,
);

/**смена extended_sort */
router.post(
  '/extended_sorting/:id',
  cpUpload,
  authMiddleware,
  userControllerAmp.changeExtendedSort,
);

/** смена логотипа пользователя админка */
router.post(
  '/cl/:id',
  cpUpload,
  authMiddleware,
  userControllerAmp.changeImage,
);

/**
 * update пользователя портала
 */
router.post('/update/:id', authMiddleware, userControllerAmp.update);

/**
 * получение групп и вида мех обработки для пользователя портала adm
 */
router.get('/toms', authMiddleware, userControllerAmp.getToms);

/**
 * получить всех пользователей adm
 */
router.get('/', authMiddleware, userControllerAmp.getUsersNoLimit);

/**
 * ADM
 * block end
 */

/**
 * Client
 * block start
 */
// Login kl
router.post('/login', apiLimiter, userControllerAmp.login);
// Logout kl
router.post('/logout', userControllerAmp.logout);
//refresh token kl
router.get('/refresh', userControllerAmp.refresh);

/**
 * получение групп и вида мех обработки для пользователя портала kl
 */
router.get('/tomskl', authAmpMiddleware, userControllerAmp.getToms);

/**
 * получение групп и вида мех обработки для пользователя портала kl развернутое
 */
router.get('/tomsklunwind', authMiddleware, userControllerAmp.getTomsUnwind);

/**
 * получение данных пользователя kl
 */
router.get('/get_user', authAmpMiddleware, userControllerAmp.getUserDetailsToken);

/**
 * update пользователя портала в одном месте kl
 */
router.put(
  '/update_user_portal',
  cpUpload,
  authAmpMiddleware,
  userControllerAmp.updateUserPortal,
);

router.put(
  '/ulv',
  cpUpload,
  authMiddleware,
  userControllerAmp.updateLastVisitUser,
);

/**
 * обновить виды мех обработки пользователя по его ID kl
 */
router.put(
  '/update_meh_user',
  authAmpMiddleware,
  userControllerAmp.updateMehToIdClient,
);

/**
 * отдаем список из коллекции пользователей у которых work_category встретилась хотя бы 1 раз kl
 */
router.get('/find_user', userControllerAmp.getfindUsers);

/**
 * ищем пользователей по их мех обработке kl
 */
router.post(
  '/find_user/:page/:limit',
  authAmpMiddleware,
  userControllerAmp.findUsers,
);

/**
 * детальная страница пользователя kl
 */
router.get(
  '/users_portal/:id',
  authAmpMiddleware,
  userControllerAmp.getUserDetailsToken,
);

/**
 * Client
 * block end
 */

//владелец заказа(справочник)
router.get('/iu', authAmpMiddleware, userControllerAmp.getInhereUser);
//user to ID
router.get('/:id', authAmpMiddleware, userControllerAmp.getUserDetails); //??????

/**
 * get user on token info
 */

/**
 * TODO
 * смена населенного пункта
 */
router.post('/cs/:id', authAmpMiddleware, userControllerAmp.changeCities);

//post partners card()
router.get('/partners/:page/:limit', userControllerAmp.getPartners);

/**
 * change enabled user
 */
router.post('/state/:id', authAmpMiddleware, userControllerAmp.changeState);

/**
 * пометить на удаление пользователя портала
 */
router.post('/delete/:id', authAmpMiddleware, userControllerAmp.deleteUserPortal);

/**
 * признак служебного пользователя
 */
router.post('/service/:id', authAmpMiddleware, userControllerAmp.stateServiceUser);

/**смена пароля ссылка в почту */
router.post('/change_password', cpUpload, userControllerAmp.changePasswordLink);

/**смена пароля пользователем самостоятельно */
router.post('/new_password_url', cpUpload, userControllerAmp.newPasswordUrl);

/**смена пароля пользователем самостоятельно из личного кабинета */
router.post(
  '/new_password_profile',
  authAmpMiddleware,
  cpUpload,
  userControllerAmp.newPasswordProfile,
);

// module.exports = router;
