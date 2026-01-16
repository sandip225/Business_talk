import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImage from '../../assets/logo.jpg';
import {
    Mic,
    Plus,
    Edit,
    Trash2,
    LogOut,
    BarChart3,
    Calendar,
    Clock,
    Loader2,
    FileText,
    Eye,
    EyeOff,
    Upload,
    Info,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { podcastAPI, blogAPI, Blog } from '../../services/api';
import { useAuthStore, usePodcastStore } from '../../store/useStore';

type ActiveTab = 'podcasts' | 'blogs' | 'import' | 'about';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { podcasts, setPodcasts, removePodcast } = usePodcastStore();
    const [isLoading, setIsLoading] = useState(true);

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | Admin Dashboard";
    }, []);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
    const [blogStats, setBlogStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('podcasts');
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [blogsLoading, setBlogsLoading] = useState(false);

    // Search and Pagination state
    const ITEMS_PER_PAGE = 10;
    const [podcastSearch, setPodcastSearch] = useState('');
    const [podcastPage, setPodcastPage] = useState(1);
    const [blogSearch, setBlogSearch] = useState('');
    const [blogPage, setBlogPage] = useState(1);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch podcasts with thumbnails for admin preview
                // No limit - get all podcasts
                const [podcastsRes, statsRes] = await Promise.all([
                    podcastAPI.getAll(),
                    podcastAPI.getStats(),
                ]);
                setPodcasts(podcastsRes.data.podcasts);
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate, setPodcasts]);

    useEffect(() => {
        if (activeTab === 'blogs' && blogs.length === 0) {
            fetchBlogs();
        }
    }, [activeTab]);

    const fetchBlogs = async () => {
        setBlogsLoading(true);
        try {
            const [blogsRes, statsRes] = await Promise.all([
                blogAPI.getAdminAll(),
                blogAPI.getStats(),
            ]);
            setBlogs(blogsRes.data.blogs || []);
            setBlogStats(statsRes.data.stats || { total: 0, published: 0, drafts: 0 });
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setBlogsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleDeletePodcast = async (id: string) => {
        if (!confirm('Are you sure you want to delete this podcast?')) return;

        setDeleteId(id);
        try {
            await podcastAPI.delete(id);
            removePodcast(id);
            setStats((prev) => ({
                ...prev,
                total: prev.total - 1,
                [podcasts.find((p) => p._id === id)?.category || 'past']:
                    prev[podcasts.find((p) => p._id === id)?.category === 'upcoming' ? 'upcoming' : 'past'] - 1,
            }));
        } catch (error) {
            console.error('Error deleting podcast:', error);
            alert('Failed to delete podcast');
        } finally {
            setDeleteId(null);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        setDeleteId(id);
        try {
            await blogAPI.delete(id);
            setBlogs((prev) => prev.filter((b) => b._id !== id));
            setBlogStats((prev) => ({
                ...prev,
                total: prev.total - 1,
            }));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        } finally {
            setDeleteId(null);
        }
    };

    // Filter podcasts by category AND search term
    const searchFilteredPodcasts = podcasts.filter((podcast) => {
        const matchesCategory = filter === 'all' ? true : podcast.category === filter;
        const searchLower = podcastSearch.toLowerCase();
        const matchesSearch = podcastSearch === '' ||
            podcast.title?.toLowerCase().includes(searchLower) ||
            podcast.guestName?.toLowerCase().includes(searchLower) ||
            podcast.episodeNumber?.toString().includes(podcastSearch) ||
            podcast.description?.toLowerCase().includes(searchLower);
        return matchesCategory && matchesSearch;
    });

    // Paginate podcasts
    const totalPodcastPages = Math.ceil(searchFilteredPodcasts.length / ITEMS_PER_PAGE);
    const paginatedPodcasts = searchFilteredPodcasts.slice(
        (podcastPage - 1) * ITEMS_PER_PAGE,
        podcastPage * ITEMS_PER_PAGE
    );

    // Filter blogs by search term
    const searchFilteredBlogs = blogs.filter((blog) => {
        const searchLower = blogSearch.toLowerCase();
        return blogSearch === '' ||
            blog.title?.toLowerCase().includes(searchLower) ||
            blog.category?.toLowerCase().includes(searchLower) ||
            blog.author?.toLowerCase().includes(searchLower) ||
            blog.excerpt?.toLowerCase().includes(searchLower);
    });

    // Paginate blogs
    const totalBlogPages = Math.ceil(searchFilteredBlogs.length / ITEMS_PER_PAGE);
    const paginatedBlogs = searchFilteredBlogs.slice(
        (blogPage - 1) * ITEMS_PER_PAGE,
        blogPage * ITEMS_PER_PAGE
    );

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="h-10 w-auto"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Business+Talk&size=200&background=8B1538&color=fff&bold=true'; }}
                            />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                View Site
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('podcasts')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'podcasts'
                            ? 'bg-maroon-700 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Mic className="w-5 h-5" />
                        Podcasts
                    </button>
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'blogs'
                            ? 'bg-maroon-700 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        Blogs
                    </button>
                    <Link
                        to="/admin/calendar"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Calendar className="w-5 h-5" />
                        Calendar
                    </Link>
                    <Link
                        to="/admin/import"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Upload className="w-5 h-5" />
                        Import
                    </Link>
                    <Link
                        to="/admin/about"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                        title="Manage About Us Content"
                    >
                        <Info className="w-5 h-5" />
                        About Us
                    </Link>
                </div>

                {/* Podcasts Tab */}
                {activeTab === 'podcasts' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Episodes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Upcoming</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Published</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.past}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Podcasts Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">All Podcasts</h2>
                                        <p className="text-sm text-gray-500">
                                            Showing {paginatedPodcasts.length} of {searchFilteredPodcasts.length} podcasts
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {/* Filter */}
                                        <div className="flex items-center space-x-2">
                                            {(['all', 'upcoming', 'past'] as const).map((f) => (
                                                <button
                                                    key={f}
                                                    onClick={() => { setFilter(f); setPodcastPage(1); }}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === f
                                                        ? 'bg-maroon-700 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <Link
                                            to="/admin/podcast/new"
                                            className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Podcast</span>
                                        </Link>
                                    </div>
                                </div>
                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by title, guest, episode #..."
                                        value={podcastSearch}
                                        onChange={(e) => { setPodcastSearch(e.target.value); setPodcastPage(1); }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="divide-y">
                                {isLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading podcasts...</p>
                                    </div>
                                ) : paginatedPodcasts.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-gray-500">{podcastSearch ? 'No podcasts match your search.' : 'No podcasts found.'}</p>
                                        {!podcastSearch && (
                                            <Link
                                                to="/admin/podcast/new"
                                                className="inline-flex items-center space-x-2 mt-4 text-maroon-700 hover:text-maroon-800"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Create your first podcast</span>
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    paginatedPodcasts.map((podcast) => (
                                        <motion.div
                                            key={podcast._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-sm font-bold text-maroon-700">
                                                            #{podcast.episodeNumber}
                                                        </span>
                                                        <span
                                                            className={`badge ${podcast.category === 'upcoming'
                                                                ? 'badge-upcoming'
                                                                : 'badge-past'
                                                                }`}
                                                        >
                                                            {podcast.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {podcast.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        Guest: {podcast.guestName} • {podcast.guestTitle}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {formatDate(podcast.scheduledDate)} • {podcast.scheduledTime}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/admin/podcast/edit/${podcast._id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeletePodcast(podcast._id)}
                                                        disabled={deleteId === podcast._id}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteId === podcast._id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPodcastPages > 1 && (
                                <div className="p-4 border-t flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Page {podcastPage} of {totalPodcastPages}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setPodcastPage(p => Math.max(1, p - 1))}
                                            disabled={podcastPage === 1}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </button>
                                        {/* Page numbers */}
                                        <div className="hidden sm:flex items-center space-x-1">
                                            {Array.from({ length: Math.min(5, totalPodcastPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPodcastPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (podcastPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (podcastPage >= totalPodcastPages - 2) {
                                                    pageNum = totalPodcastPages - 4 + i;
                                                } else {
                                                    pageNum = podcastPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPodcastPage(pageNum)}
                                                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${podcastPage === pageNum
                                                            ? 'bg-maroon-700 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setPodcastPage(p => Math.min(totalPodcastPages, p + 1))}
                                            disabled={podcastPage === totalPodcastPages}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Blogs Tab */}
                {activeTab === 'blogs' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Blogs</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.total}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Published</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.published}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                        <EyeOff className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Drafts</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.drafts}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Blogs Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">All Blogs</h2>
                                        <p className="text-sm text-gray-500">
                                            Showing {paginatedBlogs.length} of {searchFilteredBlogs.length} blogs
                                        </p>
                                    </div>
                                    <Link
                                        to="/admin/blog/new"
                                        className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Blog</span>
                                    </Link>
                                </div>
                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by title, category, author..."
                                        value={blogSearch}
                                        onChange={(e) => { setBlogSearch(e.target.value); setBlogPage(1); }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="divide-y">
                                {blogsLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading blogs...</p>
                                    </div>
                                ) : paginatedBlogs.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-gray-500">{blogSearch ? 'No blogs match your search.' : 'No blogs found.'}</p>
                                        {!blogSearch && (
                                            <Link
                                                to="/admin/blog/new"
                                                className="inline-flex items-center space-x-2 mt-4 text-maroon-700 hover:text-maroon-800"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Create your first blog post</span>
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    paginatedBlogs.map((blog) => (
                                        <motion.div
                                            key={blog._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                            {blog.category}
                                                        </span>
                                                        {blog.isPublished ? (
                                                            <span className="flex items-center gap-1 text-xs text-green-600">
                                                                <Eye className="w-3 h-3" /> Published
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-xs text-yellow-600">
                                                                <EyeOff className="w-3 h-3" /> Draft
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                                                        {blog.excerpt}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        By {blog.author} • {formatDate(blog.createdAt)} • {blog.readTime}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/admin/blog/edit/${blog._id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                        disabled={deleteId === blog._id}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteId === blog._id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalBlogPages > 1 && (
                                <div className="p-4 border-t flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Page {blogPage} of {totalBlogPages}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                                            disabled={blogPage === 1}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </button>
                                        {/* Page numbers */}
                                        <div className="hidden sm:flex items-center space-x-1">
                                            {Array.from({ length: Math.min(5, totalBlogPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalBlogPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (blogPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (blogPage >= totalBlogPages - 2) {
                                                    pageNum = totalBlogPages - 4 + i;
                                                } else {
                                                    pageNum = blogPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setBlogPage(pageNum)}
                                                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${blogPage === pageNum
                                                            ? 'bg-maroon-700 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setBlogPage(p => Math.min(totalBlogPages, p + 1))}
                                            disabled={blogPage === totalBlogPages}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
