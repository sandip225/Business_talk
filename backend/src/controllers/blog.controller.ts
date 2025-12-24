import { Request, Response } from 'express';
import { Blog } from '../models/Blog';

// Get all blogs (public - only published)
export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        const query: any = {};

        // Only show published blogs for public access
        if (!(req as any).user) {
            query.isPublished = true;
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
};

// Get all blogs for admin (including unpublished)
export const getAdminBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ blogs });
    } catch (error) {
        console.error('Error fetching admin blogs:', error);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
};

// Get single blog by ID
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Only allow unpublished blogs for authenticated users
        if (!blog.isPublished && !(req as any).user) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
};

// Create new blog (admin only)
export const createBlog = async (req: Request, res: Response) => {
    try {
        const { title, excerpt, content, author, category, image, readTime, tags, isPublished } = req.body;

        const blog = new Blog({
            title,
            excerpt,
            content,
            author: author || 'Deepak Bhatt',
            category,
            image,
            readTime: readTime || '5 min read',
            tags: tags || [],
            isPublished: isPublished || false,
        });

        await blog.save();

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Failed to create blog' });
    }
};

// Update blog (admin only)
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Failed to update blog' });
    }
};

// Delete blog (admin only)
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Failed to delete blog' });
    }
};

// Get blog stats (admin only)
export const getBlogStats = async (req: Request, res: Response) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ isPublished: true });
        const draftBlogs = await Blog.countDocuments({ isPublished: false });

        const categories = await Blog.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        res.json({
            stats: {
                total: totalBlogs,
                published: publishedBlogs,
                drafts: draftBlogs,
                categories,
            },
        });
    } catch (error) {
        console.error('Error fetching blog stats:', error);
        res.status(500).json({ message: 'Failed to fetch blog stats' });
    }
};
