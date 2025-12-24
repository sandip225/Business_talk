import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllBlogs,
    getAdminBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogStats,
} from '../controllers/blog.controller';

const router = Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes (admin only)
router.get('/admin/all', authenticateToken, getAdminBlogs);
router.get('/admin/stats', authenticateToken, getBlogStats);
router.post('/', authenticateToken, createBlog);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);

export default router;
