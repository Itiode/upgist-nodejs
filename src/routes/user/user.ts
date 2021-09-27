import Router from 'express';

const router = Router();

import {
  addUser,
  getUsers,
  updateBankDetails,
} from '../../controllers/user/user';
import admin from '../../middleware/admin';
import auth from '../../middleware/auth';

router.post('/', addUser);
router.get('/', auth, admin, getUsers);
router.put('/bank-details', auth, updateBankDetails);

export default router;
