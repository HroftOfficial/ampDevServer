import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { workGroupController } from '../controllers/workGroup-controller';
export const router = express.Router();

/** получить все группы предприятий */
router.get('/', authMiddleware, workGroupController.getWorkGroup);

/** создать группу предприятия */
router.post('/create', authMiddleware, workGroupController.createWorkGroup);

/**получить определенную группу предприятия */
router.post('/:id', authMiddleware, workGroupController.getWorkGroupDetails);

/** обновить группу предприятий */
router.post(
  '/update/:id',
  authMiddleware,
  workGroupController.updateWorkGroupItems,
);

/**удалить или восстановить группу предприятий adm */
router.post('/state/:id', authMiddleware, workGroupController.stateWorkGroup);
