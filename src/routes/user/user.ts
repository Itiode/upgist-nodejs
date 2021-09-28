import Router from 'express';

const router = Router();

import {
  addUser,
  getUsers,
  updateBankDetails,
  assignRole,
} from '../../controllers/user/user';
import admin from '../../middleware/admin';
import auth from '../../middleware/auth';
import { getUser } from '../../controllers/user/user';

router.post('/', addUser);
router.get('/me', auth, getUser);
router.get('/', auth, admin, getUsers);
router.put('/bank-details', auth, updateBankDetails);
router.put('/assign-role', auth, assignRole);

export default router;
