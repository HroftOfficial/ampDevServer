import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { newsController } from '../controllers/news-controller';
import multer from 'multer';
import { config } from '../config/config';
import path from 'path';

export const router = express.Router();
const { DESTINATION_NEWS } = config;

const storage = multer.diskStorage({
  destination: './public/uploads/' + DESTINATION_NEWS,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    checkFileType(file, cb);
  },
});


const cpUpload = upload.fields([{ name: 'images', maxCount: 1 }]);

// Check File Type
const checkFileType = (
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Массив допустимых MIME-типов
  const allowedMimeTypes = [
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

/** создание новости */
router.post(
  '/create',
  authMiddleware,
  cpUpload,
  newsController.create,
);

/** смена фото новости */
router.post(
  '/ci/:id',
  authMiddleware,
  cpUpload,
  newsController.changeImage,
);

/**update новости */
router.post('/update/:id', authMiddleware, newsController.update);
/** main */
/**change enabled user */
router.post('/state/:id', authMiddleware, newsController.changeState);

/** удалить новость */
router.delete('/delete/:id', authMiddleware, newsController.deleteNews);

/**смена даты */
router.post('/cd/:id', authMiddleware, newsController.changeDate);

/**получить все новости */
router.get('/', authMiddleware, newsController.getNews);

/**получить новость */
router.get('/:id', newsController.getNewsId);

/**получить новости постранично*/
router.get('/:page/:limit', newsController.getNewsLimit);
