import Router from 'express';

const router = Router();

import { adClick, getAdClicksCount } from '../controllers/ad-click';
import auth from '../middleware/auth';

router.post('/', auth, adClick);
router.get('/count/:userId', getAdClicksCount);

export default router;
