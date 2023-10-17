import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { plantApController } from '../controllers/plant-controllerAp';
import multer from 'multer';
import { config } from '../config/config';
import path from 'path';

export const router = express.Router();
const { DESTINATION_PLANT_AP } = config;

const storage = multer.diskStorage({
  destination: './public/uploads/' + DESTINATION_PLANT_AP,
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

const cpUpload = upload.fields([
  { name: 'photo_plant', maxCount: 10 },
  { name: 'file_plant', maxCount: 10 },
]);

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

/**получить все оборудованиe */
router.get('/', authMiddleware, plantApController.getPlant);

//get plant profile User
router.get('/client', authAmpMiddleware, plantApController.getPlantProfile);

/**создать оборудованиe */
router.post('/create', authMiddleware, cpUpload, plantApController.createPlant);

/** favorite start*/

//get favorite plant to User
router.get('/get_favorite', authAmpMiddleware, plantApController.getFavorite);

//add favorite plant to User
router.post('/add_favorite', authAmpMiddleware, plantApController.addFavorite);

//delete favorite
router.post(
  '/delete_favorite',
  authAmpMiddleware,
  plantApController.deleteFavorite,
);

/** favorite end*/
/**add plant profile */
router.post(
  '/add_plant_profile',
  authAmpMiddleware,
  cpUpload,
  plantApController.addPlantProfile,
);
/**edit plant profile */
router.post(
  '/update_plant_profile/:id',
  authAmpMiddleware,
  cpUpload,
  plantApController.updatePlantProfile,
);
//delete plant to profile
router.delete(
  '/profile/:id',
  authAmpMiddleware,
  plantApController.deletePlantProfile,
);
router.post(
  '/profile/:id',
  authAmpMiddleware,
  plantApController.unDeletePlantProfile,
);

/**client post filter page */
router.post('/:page', plantApController.postFilter);

/**получить определеное оборудование */
router.get('/:id', authMiddleware, plantApController.getPlantDetails);

/**получить определеное оборудование client*/
router.get('/client/:id', plantApController.getPlantDetails);

/**обновить оборудование */
router.post(
  '/update/:id',
  authMiddleware,
  cpUpload,
  plantApController.updatePlantAll,
);

/**delete files(photo) plant */
router.post(
  '/deletef/:id',
  authMiddleware,
  cpUpload,
  plantApController.deleteFile,
);

/**delete files(photo) plant */
router.post(
  '/deletefc/:id',
  authAmpMiddleware,
  cpUpload,
  plantApController.deleteFile,
);

/** удалить или восстановить оборудование */
router.post('/delete/:id', authMiddleware, plantApController.deletePlant);

/** удалить или восстановить оборудование */
router.post('/enabled/:id', authMiddleware, plantApController.enabledPlant);

/**смена населенного пункта */
router.post('/cs/:id', authMiddleware, plantApController.changeCities);

/** получить историю  по его ID adm*/
router.get('/history/:id', authMiddleware, plantApController.getHistoryToId);
