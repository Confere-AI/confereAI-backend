import { express } from 'express';
import { userController } from '../controllers/user.controller';
const router = express.Router();

router.get('/me', userController.myProfile);
//router.get('/:id', userController.getUserById);

export default router;