import Router from 'express';

const router = Router();

import {
  addUser,
  getUsers,
  updateUser,
  getUserAsAdmin,
  updateBankDetails,
  assignRole, getUser, getUsersCount,
} from '../../controllers/user/user';
import admin from '../../middleware/admin';
import auth from '../../middleware/auth';

router.post('/', addUser);
router.get('/me', auth, getUser);
router.put('/me', auth, updateUser);
router.get('/admin/:phone', auth, admin, getUserAsAdmin);
router.get('/admin', auth, admin, getUsers);
router.put('/me/bank-details', auth, updateBankDetails);
router.put('/assign-role', auth, assignRole);
router.get('/count', auth, admin, getUsersCount);

export default router;
