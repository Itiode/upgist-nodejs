import Router from 'express';

const router = Router();

import { auth } from '../../controllers/user/auth';

router.post('/', auth);

export default router;
