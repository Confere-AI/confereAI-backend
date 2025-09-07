import express from 'express';
import { myProfile } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/me', myProfile);
//router.get('/:id', userController.getUserById);

export default router;