import express from 'express';
import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { authMiddleware } from '../middleware/auth-middleware';
import multer from 'multer';
import { config } from '../config/config';
import path from 'path';

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

// Check File Type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
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

const cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }]);

import {
  createMessage,
  getMessages,
  firstMessages,
  getInitMessages,
} from '../controllers/message-controller';

router.post('/', authAmpMiddleware, cpUpload, createMessage);

router.get(
  '/init',
  authAmpMiddleware,
  getInitMessages,
);

router.get('/:chatId', authMiddleware, getMessages);
router.get('/cl/:chatId', authAmpMiddleware, getMessages);

router.post(
  '/first',
  authAmpMiddleware,
  cpUpload,
  firstMessages,
);
