import express from 'express';
import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { draftController } from '../controllers/draft.controller';
import multer from 'multer';
import { config } from '../config/config';
import path from 'path';
export const router = express.Router();

//=========== / Image and files upload =====//
const storage = multer.diskStorage({
  destination: './public/uploads/' + config?.DESTINATION_SEND_ZVK,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    checkFileType(file, cb);
  },
});

const cpUpload = upload.fields([{ name: 'uploadFile', maxCount: 5 }]);

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|dvg/;
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

//отдаем пользователю даненые по телеграм ссылке по ID заказа
router.get('/get_telegram/:id', draftController.getTelegramDetails);
//автопоиск по user_id payload
router.post('/auto_find', authAmpMiddleware, draftController.getDraftAutoFind);
router.get('/meh', draftController.getMehData);
/**получить все заказы с уровнем доступа пользователя */
router.post('/', authAmpMiddleware, draftController.getDrafted);
/**получить все общие заказы */
router.post('/share', draftController.getDrafted);
router.get('/share/detail/:id', draftController.getDraftDetail);

router.get('/detail/:id', authAmpMiddleware, draftController.getDraftDetail);
// оправка сообщения о заинтересовавшей заявке
router.post('/send', cpUpload, authAmpMiddleware, draftController.sendZvk);
