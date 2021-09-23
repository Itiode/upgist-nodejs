import Router from 'express';

const router = Router();

import { adClick } from '../controllers/ad-click';
import auth from '../middleware/auth';

router.post('/', auth, adClick);

export default router;
