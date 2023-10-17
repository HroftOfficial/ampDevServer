import express from 'express';
import { authAmpMiddleware } from '../middleware/authAmp-middleware'; 
import { infoController } from '../controllers/info.controller';

export const router = express.Router();

//news
/**Get all news */
router.get('/', infoController.getInfo);

/** Data form registration */
router.post('/', infoController.sendZvkForm);

/**get info from hand search */
// router.get('/get_info', authMiddleware, infoController.getInfoData);

/**find zakazes of array hand search */
router.post(
  '/get_info/:page/:limit',
  authAmpMiddleware,
  infoController.getZakazesInfoData,
);
