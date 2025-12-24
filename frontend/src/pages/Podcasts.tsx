import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import PodcastCard from '../components/podcast/PodcastCard';
import { podcastAPI, Podcast } from '../services/api';
import { usePodcastStore } from '../store/useStore';

const categories = ['All', 'Upcoming', 'Past'];

export default function Podcasts() {
    const { podcasts, upcomingPodcasts, pastPodcasts, setPodcasts, setLoading, isLoading } = usePodcastStore();
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchPodcasts = async () => {
            setLoading(true);
            try {
                const response = await podcastAPI.getAll();
                setPodcasts(response.data.podcasts);
                setError(null);
            } catch (err) {
                console.error('Error fetching podcasts:', err);
                setError('Failed to load podcasts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPodcasts();
    }, [setPodcasts, setLoading]);

    // Filter podcasts based on search and category
    const getFilteredPodcasts = () => {
        let filtered = podcasts;

        // Filter by category
        if (activeCategory === 'Upcoming') {
            filtered = upcomingPodcasts;
        } else if (activeCategory === 'Past') {
            filtered = pastPodcasts;
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (podcast) =>
                    podcast.title.toLowerCase().includes(search) ||
                    podcast.guestName.toLowerCase().includes(search) ||
                    podcast.description.toLowerCase().includes(search) ||
                    podcast.guestTitle.toLowerCase().includes(search) ||
                    podcast.guestInstitution?.toLowerCase().includes(search)
            );
        }

        return filtered;
    };

    const filteredPodcasts = getFilteredPodcasts();

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/5 to-transparent" />
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 heading-serif">
                            All <span className="text-maroon-700">Podcasts</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Explore our complete collection of insightful conversations with world-renowned
                            scholars, business leaders, and thought leaders.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 px-4 border-b border-gray-200 bg-white sticky top-16 z-40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by guest name, title, or topic..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 transition-all outline-none"
                            />
                        </div>

                        {/* Category Tabs */}
                        <div className="flex gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                            ? 'bg-maroon-700 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-maroon-50 hover:text-maroon-700'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Count */}
            <section className="py-4 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <p className="text-gray-600">
                        {isLoading ? 'Loading...' : `Showing ${filteredPodcasts.length} podcast${filteredPodcasts.length !== 1 ? 's' : ''}`}
                        {searchTerm && ` for "${searchTerm}"`}
                        {activeCategory !== 'All' && ` in ${activeCategory}`}
                    </p>
                </div>
            </section>

            {/* Podcasts Grid */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-200 rounded-xl h-80 skeleton"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : filteredPodcasts.length === 0 ? (
                        <div className="text-center py-16">
                            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No podcasts found</h3>
                            <p className="text-gray-500">
                                {searchTerm
                                    ? `No results for "${searchTerm}". Try a different search term.`
                                    : 'No podcasts available in this category.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPodcasts.map((podcast, index) => (
                                <motion.div
                                    key={podcast._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <PodcastCard podcast={podcast} variant="grid" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
