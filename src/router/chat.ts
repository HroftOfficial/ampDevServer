import express from 'express';

import {  createChat,
  userChats,
  findChat, allChats } from '../controllers/chat-controller';
import { authAmpMiddleware } from '../middleware/authAmp-middleware';
import { authMiddleware } from '../middleware/auth-middleware';
  
export const router = express.Router();
router.post(
  '/', 
  authAmpMiddleware,
  createChat);

router.get(
  '/all_chats',
  authMiddleware,
  allChats);

router.get(
  '/:userId', 
  authAmpMiddleware, 
  userChats);

router.get(
  '/find/:firstId/:secondId',
  authAmpMiddleware,
  findChat);

