import Router from 'express';

const router = Router();

import {
  addUser,
  getUsers,
  updateUser,
  getUserAsAdmin,
  updateBankDetails,
  assignRole,
} from '../../controllers/user/user';
import admin from '../../middleware/admin';
import auth from '../../middleware/auth';
import { getUser } from '../../controllers/user/user';

router.post('/', addUser);
router.get('/me', auth, getUser);
router.put('/me', auth, updateUser);
router.get('/admin/:userId', auth, admin, getUserAsAdmin);
router.get('/admin', auth, admin, getUsers);
router.put('/me/bank-details', auth, updateBankDetails);
router.put('/assign-role', auth, assignRole);

export default router;
