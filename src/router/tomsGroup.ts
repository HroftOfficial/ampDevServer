import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { tomsGroupController } from '../controllers/tomsGroup-controller';
export const router = express.Router();

/** получить все главные группы обработки */
router.get('/', authMiddleware, tomsGroupController.getTomskGroup);

/** создать группу обработки */
router.post('/create', authMiddleware, tomsGroupController.createTomsGroup);

/**получить определенную группу обработки */
router.post('/:id', authMiddleware, tomsGroupController.getTomsGroupDetails);

/** обновить группу обработки */
router.post(
  '/update/:id',
  authMiddleware,
  tomsGroupController.updateTomsGroupItems,
);

/** удалить или восстановить группу обработки */
router.post('/delete/:id', authMiddleware, tomsGroupController.deleteToms);
