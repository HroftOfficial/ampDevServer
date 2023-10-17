import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { plantGroupControllerApp } from '../controllers/plantGroup-controllerAp';
import multer from 'multer';
import { config } from '../config/config';
import path from 'path';
export const router = express.Router();
const { DESTINATION_PLANT_GROUP_AP } = config;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/uploads/' + DESTINATION_PLANT_GROUP_AP);
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    checkFileType(file, cb);
  },
});

const cpUpload = upload.fields([{ name: 'group_photo_plant', maxCount: 1 }]);

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

/**удалить или восстановить группу предприятий */
router.post('/state/:id', authMiddleware, plantGroupControllerApp.statePlantGroup);

/** создать группу оборудования*/
router.post(
  '/create',
  authMiddleware,
  cpUpload,
  plantGroupControllerApp.createPlant,
);

/**получить все группы оборудования */
router.get('/', authMiddleware, plantGroupControllerApp.getPlant);

/**получить все группы оборудования для клиента амп*/
router.get('/cl', plantGroupControllerApp.getPlant);

/** получить определенную группу оборудования */
router.post('/:id', authMiddleware, plantGroupControllerApp.getPlantDetails);

/** обновить группу оборудования */
router.post(
  '/update_all/:id',
  authMiddleware,
  cpUpload,
  plantGroupControllerApp.updatePlantAll,
);
