import express from 'express';
// import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { authMiddleware } from '../middleware/auth-middleware';
export const router = express.Router();

import { telegramController } from '../controllers/telegram-controller';

router.post('/:id', authMiddleware, telegramController.sendToTelegram);
