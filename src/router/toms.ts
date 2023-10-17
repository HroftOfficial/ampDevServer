import express from 'express';
import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { tomsController } from '../controllers/toms-controller';
export const router = express.Router();

/** получить все виды обработки */
router.get('/', authAmpMiddleware, tomsController.getToms);

/** создать вид обработки */
router.post('/create', authAmpMiddleware, tomsController.createToms);

/** получить определенный виду обработки */
router.post('/:id', authAmpMiddleware, tomsController.getTomsDetails);

/**обновить вид обработки */
router.post('/update/:id', authAmpMiddleware, tomsController.updateTomsItems);

/**удалить или восстановить виды обработки */
router.post('/delete/:id', authAmpMiddleware, tomsController.deleteToms);
