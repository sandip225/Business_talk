import express from 'express';
import { getDeployments } from '../controllers/render.controller';

const router = express.Router();

// Proxy route to get deployments from Render
// POST /api/render/deployments
router.post('/deployments', getDeployments);

export default router;
