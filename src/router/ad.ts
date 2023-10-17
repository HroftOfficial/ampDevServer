import express from 'express';
// import { authMiddleware } from '../middleware/auth-middleware';
import { authAmpMiddleware as authMiddleware } from '../middleware/authAmp-middleware';
import { adController } from '../controllers/ad-controller';
import multer from 'multer';
import { config } from '../config/config';
import path from 'path';

export const router = express.Router();

//=========== / Image and files upload =====//
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: `./public/uploads/${config?.DESTINATION_AD}`,
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
  { name: 'photo_url', maxCount: 1 },
  { name: 'file_url', maxCount: 5 },
  { name: 'preview_url', maxCount: 1 },
]);

// Check File Type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
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
//=========== / Image and files upload =====//

/**
 * Добавить новую рекламу adm
 */
router.post('/add', cpUpload, authMiddleware, adController.addAd);

/**
 * обновление данных рекламы в одном месте adm
 */
router.put('/update/:id', cpUpload, authMiddleware, adController.updateAd);

/**
 * получить всю рекламу adm
 */
router.get('/', authMiddleware, adController.getAllAd);

/**
 * получить реклама по ID adm
 */
router.get('/:id', authMiddleware, adController.getAdToId);

/**
 * change enabled реклама
 */
router.post('/state/:id', authMiddleware, adController.changeState);

/**
 * удалить рекламму
 */
router.delete('/delete/:id', authMiddleware, adController.deleteAd);
