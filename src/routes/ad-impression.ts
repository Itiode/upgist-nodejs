import Router from 'express';

const router = Router();

import { adImpression } from '../controllers/ad-impression';
import auth from '../middleware/auth';

router.post('/', auth, adImpression);

export default router;
