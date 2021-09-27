import Router from 'express';

const router = Router();

import { addUser, getUsers } from '../../controllers/user/user';
import admin from '../../middleware/admin';
import auth from '../../middleware/auth';

router.post('/', addUser);
router.get('/', auth, admin, getUsers);

export default router;
