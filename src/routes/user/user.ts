import Router from 'express';

const router = Router();

import { addUser } from '../../controllers/user/user';

router.post('/', addUser);

export default router;