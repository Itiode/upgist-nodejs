import Router from 'express';

const router = Router();

import { adClick, getAdClicksCount } from '../controllers/ad-click';
import auth from '../middleware/auth';

router.post('/', auth, adClick);
router.get('/:userId', getAdClicksCount);

export default router;
