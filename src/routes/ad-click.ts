import Router from 'express';

const router = Router();

import { adClick } from '../controllers/ad-click';

router.post('/', adClick);

export default router;
