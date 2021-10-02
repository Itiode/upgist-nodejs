import Router from 'express';

const router = Router();

import { registerAdClick, getAdClicksCount } from '../controllers/ad-click';
import auth from '../middleware/auth';

router.post('/', auth, registerAdClick);
router.get('/count/:userId', getAdClicksCount);

export default router;
