import express from 'express';
import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { authMiddleware } from '../middleware/auth-middleware';
import { zakazesController } from '../controllers/zakazes-controller';

// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';
// const config = require('../config/config');
const path = require('path');

export const router = express.Router();
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
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
  limits: { fileSize: 20000000 },
  fileFilter: function (req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    checkFileType(file, cb);
  },
});

const cpUpload = upload.fields([
  { name: 'photo_url', maxCount: 10 },
  { name: 'file_url', maxCount: 10 },
  { name: 'telegram_url', maxCount: 1 },
]);

// Check File Type
// function checkFileType(
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback,
// ) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif|pdf|dvg|dwg|xls|xlsx|doc|docx/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(null, false);
//     return cb(new Error('Такие файлы загружать не разрешено!'));
//   }
// }

const checkFileType = (
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Массив допустимых MIME-типов
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.ms-excel', // XLS
    'application/pdf', // PDF
    'image/jpeg', // JPEG
    'image/jpg', // JPG
    'image/png', // PNG
    'image/gif', // GIF
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Разрешаем загрузку
  } else {
    cb(null, false);
    return cb(new Error('Такие файлы загружать не разрешено!'));
  }
};
//=========== / Image and files upload =====//

/** Добавить новый заказ kl */
router.post(
  '/add_zakazes',
  cpUpload,
  authAmpMiddleware,
  zakazesController.addZakazes,
);

/** Добавить новый заказ adm */
router.post(
  '/add_zakazes_adm',
  cpUpload,
  authMiddleware,
  zakazesController.addZakazesAdm,
);

/** получить все заказы пользователя по ID пользователя kl */
router.get(
  '/get_zakazes',
  authAmpMiddleware,
  zakazesController.getZakazesToIdClient,
);

/** обновление данных заказа в одном месте */
router.put(
  '/update_zakaz/:id',
  cpUpload,
  authAmpMiddleware,
  zakazesController.updateZakaz,
);

/** обновление данных заказа в одном месте adm */
router.put(
  '/update_zakaz_adm/:id',
  cpUpload,
  authMiddleware,
  zakazesController.updateZakazAdm,
);

/**смена(добавление) чертежа для телеграм */
router.post(
  '/update_telegram/:id',
  cpUpload,
  authAmpMiddleware,
  zakazesController.updateTelegram,
);

/**получить историю заказа по его ID adm */
router.get('/history/:id', authMiddleware, zakazesController.getHistoryToId);

/** отдать все заказы пользователя по признаку favorite */
router.get('/get_favorite', authAmpMiddleware, zakazesController.getFavorite);

/** получить все заказы adm */
router.get('/', authMiddleware, zakazesController.getAllZakazes);

/** получить заказ по ID adm */
router.get('/:id', authMiddleware, zakazesController.getZakazesToId);

/** change enabled zakaz */
router.post('/state/:id', authMiddleware, zakazesController.changeState);

/**удаление пользователя(пометка на удаление) kl */
router.post('/delete/:id', authMiddleware, zakazesController.deleteZakaz);

/**delete files(photo) plant */
router.post(
  '/deletef/:id',
  authMiddleware,
  cpUpload,
  zakazesController.deleteFileZakaz,
);

/**добавить пользователю заказ в favorite */
router.post('/add_favorite', authAmpMiddleware, zakazesController.addFavorite);

/**удалить у пользователя заказ из favorite */
router.post(
  '/delete_favorite',
  authAmpMiddleware,
  zakazesController.deleteFavorite,
);

/** обновим в базе данных название организации владельца чертежа */
