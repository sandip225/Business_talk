import { Router } from 'express';
import { getClusters } from '../controllers/mongodb.controller';

const router = Router();

router.post('/clusters', getClusters);

export default router;
