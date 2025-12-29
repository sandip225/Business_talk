import { Response } from 'express';
import { Podcast } from '../models/Podcast';
import { AuthRequest } from '../middleware/auth';
import { isDBConnected } from '../config/db';

// Mock data for demo mode
const mockPodcasts = [
    {
        _id: '447',
        title: 'Business Talk with Prof. Robin Landa, MFA',
        description: 'Distinguished Professor at Kean University discusses branding as a cultural force.',
        category: 'upcoming',
        guestName: 'Prof. Robin Landa, MFA',
        guestTitle: 'Distinguished Professor',
        guestInstitution: 'Kean University',
        guestImage: '',
        thumbnailImage: '',
        episodeNumber: 447,
        scheduledDate: '2025-06-28T00:00:00.000Z',
        scheduledTime: '10:00 PM IST',
        tags: ['branding', 'design', 'marketing'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '446',
        title: 'Business Talk with Prof. Ravi Bapna & Prof. Anindya Ghose',
        description: 'Thrive: Maximizing Well-Being in the Age of AI.',
        category: 'upcoming',
        guestName: 'Prof. Ravi Bapna & Prof. Anindya Ghose',
        guestTitle: 'Professors of Information Systems',
        guestInstitution: 'University of Minnesota & NYU Stern',
        guestImage: '',
        thumbnailImage: '',
        episodeNumber: 446,
        scheduledDate: '2025-06-25T00:00:00.000Z',
        scheduledTime: '10:00 PM IST',
        tags: ['AI', 'well-being', 'technology'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '445',
        title: 'Business Talk with Prof. Michael Useem',
        description: 'The Leader Checklist: Lessons from Management 100.',
        category: 'upcoming',
        guestName: 'Prof. Michael Useem',
        guestTitle: 'Professor of Management',
        guestInstitution: 'The Wharton School',
        guestImage: '',
        thumbnailImage: '',
        episodeNumber: 445,
        scheduledDate: '2025-06-21T00:00:00.000Z',
        scheduledTime: '10:00 PM IST',
        tags: ['leadership', 'management', 'checklist'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '444',
        title: 'Business Talk with Prof. Michael Nagler',
        description: 'The Search for a Nonviolent Future.',
        category: 'upcoming',
        guestName: 'Prof. Michael Nagler',
        guestTitle: 'Professor of Economics',
        guestInstitution: 'Lehman College, CUNY',
        guestImage: '',
        thumbnailImage: '',
        episodeNumber: 444,
        scheduledDate: '2025-06-18T00:00:00.000Z',
        scheduledTime: '10:00 PM IST',
        tags: ['economics', 'philosophy'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Get all podcasts (public)
export const getAllPodcasts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category, limit, page = 1 } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = limit ? parseInt(limit as string, 10) : 500;

        // Use mock data if DB not connected
        if (!isDBConnected()) {
            let filtered = [...mockPodcasts];
            if (category && (category === 'upcoming' || category === 'past')) {
                filtered = filtered.filter(p => p.category === category);
            }
            res.json({
                podcasts: filtered,
                pagination: {
                    total: filtered.length,
                    page: pageNum,
                    pages: 1,
                    limit: limitNum,
                },
            });
            return;
        }

        const query: Record<string, unknown> = {};
        if (category && (category === 'upcoming' || category === 'past')) {
            query.category = category;
        }

        const skip = (pageNum - 1) * limitNum;

        const [podcasts, total] = await Promise.all([
            Podcast.find(query)
                .sort({ scheduledDate: category === 'upcoming' ? 1 : -1 })
                .skip(skip)
                .limit(limitNum),
            Podcast.countDocuments(query),
        ]);

        res.json({
            podcasts,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                limit: limitNum,
            },
        });
    } catch (error) {
        console.error('Get podcasts error:', error);
        res.status(500).json({ message: 'Server error fetching podcasts' });
    }
};

// Get single podcast (public)
export const getPodcastById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            const podcast = mockPodcasts.find(p => p._id === req.params.id);
            if (!podcast) {
                res.status(404).json({ message: 'Podcast not found' });
                return;
            }
            res.json(podcast);
            return;
        }

        const podcast = await Podcast.findById(req.params.id);

        if (!podcast) {
            res.status(404).json({ message: 'Podcast not found' });
            return;
        }

        res.json(podcast);
    } catch (error) {
        console.error('Get podcast error:', error);
        res.status(500).json({ message: 'Server error fetching podcast' });
    }
};

// Create podcast (admin only)
export const createPodcast = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available. Please start MongoDB.' });
            return;
        }

        // Log data size for debugging
        const dataSize = JSON.stringify(req.body).length;
        console.log(`📦 Creating podcast, data size: ${Math.round(dataSize / 1024)}KB`);

        // Check if data is too large (MongoDB limit is 16MB, but we should stay well under)
        if (dataSize > 10 * 1024 * 1024) { // 10MB limit
            console.error('❌ Podcast data too large:', dataSize);
            res.status(413).json({ message: 'Podcast data too large. Please use smaller images.' });
            return;
        }

        const podcast = await Podcast.create(req.body);
        console.log(`✅ Podcast created: ${podcast.title}`);
        res.status(201).json({
            message: 'Podcast created successfully',
            podcast,
        });
    } catch (error: any) {
        console.error('❌ Create podcast error:', error.message || error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        res.status(500).json({
            message: 'Server error creating podcast',
            error: error.message || 'Unknown error'
        });
    }
};

// Update podcast (admin only)
export const updatePodcast = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available. Please start MongoDB.' });
            return;
        }

        const podcast = await Podcast.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!podcast) {
            res.status(404).json({ message: 'Podcast not found' });
            return;
        }

        res.json({
            message: 'Podcast updated successfully',
            podcast,
        });
    } catch (error) {
        console.error('Update podcast error:', error);
        res.status(500).json({ message: 'Server error updating podcast' });
    }
};

// Delete podcast (admin only)
export const deletePodcast = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available. Please start MongoDB.' });
            return;
        }

        const podcast = await Podcast.findByIdAndDelete(req.params.id);

        if (!podcast) {
            res.status(404).json({ message: 'Podcast not found' });
            return;
        }

        res.json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        console.error('Delete podcast error:', error);
        res.status(500).json({ message: 'Server error deleting podcast' });
    }
};

// Upload image - compresses and converts to Base64 for MongoDB storage
// Uses sharp to resize/compress images to keep them small
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const fs = await import('fs');
        const sharp = (await import('sharp')).default;

        // Read and compress the image
        const compressedBuffer = await sharp(req.file.path)
            .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 75 })
            .toBuffer();

        // Convert to Base64
        const base64 = compressedBuffer.toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64}`;

        // Delete temp file
        fs.unlinkSync(req.file.path);

        console.log(`✅ Image compressed and converted to Base64 (${Math.round(base64.length / 1024)}KB)`);

        res.json({
            message: 'Image uploaded successfully',
            imageUrl,
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ message: 'Server error uploading image' });
    }
};

// Get podcast statistics
export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            const upcoming = mockPodcasts.filter(p => p.category === 'upcoming').length;
            const past = mockPodcasts.filter(p => p.category === 'past').length;
            res.json({
                total: mockPodcasts.length,
                upcoming,
                past,
            });
            return;
        }

        const [totalPodcasts, upcomingCount, pastCount] = await Promise.all([
            Podcast.countDocuments(),
            Podcast.countDocuments({ category: 'upcoming' }),
            Podcast.countDocuments({ category: 'past' }),
        ]);

        res.json({
            total: totalPodcasts,
            upcoming: upcomingCount,
            past: pastCount,
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};
