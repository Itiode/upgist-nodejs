import Router from 'express';

const router = Router();

import auth from './../middleware/auth';
import { getNewsAsAdmin, getNews } from './../controllers/news';

// TODO: Add admin middleware.
router.get('/admin', auth, getNewsAsAdmin);
router.get('/', getNews);

export default router;
