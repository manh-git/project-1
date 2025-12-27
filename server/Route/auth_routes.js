import {signup, login, logout,getMe,resetPassword,forgotP,updateMyPassword} from '../controllers/auth_c.js'
import { protect } from '../middleware/authMiddlewares.js'

import express from 'express';
const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.post('/logout',logout);
router.post('/forgotPassword', forgotP);
router.patch('/resetPassword/:token',resetPassword);
router.patch('/updateMyPassword',protect,updateMyPassword);

router.get('/me', protect,getMe);

export default router;
