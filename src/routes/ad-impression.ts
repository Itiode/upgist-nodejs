import Router from 'express';

const router = Router();

import { registerAdImpression, getAdImpressionsCount } from '../controllers/ad-impression';
import auth from '../middleware/auth';

router.post('/', auth, registerAdImpression);
router.get('/count/:userId', getAdImpressionsCount);

export default router;
