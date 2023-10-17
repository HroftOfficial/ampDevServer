import express from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { userController } from '../controllers/users-controller';
export const router = express.Router();

/**Login*/
router.post('/login', userController.login);

/**Logout */
router.post('/logout', userController.logout);

/** Refresh token */
router.get('/refresh', userController.refresh);

/** Registration */
router.post('/registration', authMiddleware, userController.registration);

/**change enabled user */
router.post('/state/:id', authMiddleware, userController.changeState);

/** удалить или восстановить пользователя АДМ */
router.post('/delete/:id', authMiddleware, userController.deleteUsers);

// get all users JSON
router.get('/', authMiddleware, userController.getUsersNoLimit);
//user to ID
router.post('/:id', authMiddleware, userController.getUserDetails);
//update users on ID
router.post('/update/:id', authMiddleware, userController.updateUsers);
//update password on user ID
router.post(
  '/update_password/:id',
  authMiddleware,
  userController.updatePassword,
);
// module.exports = router;
