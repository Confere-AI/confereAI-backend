import express from 'express';
import { myProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/me', authMiddleware ,myProfile);
//router.get('/:id', userController.getUserById);

export default router;