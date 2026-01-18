import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PodcastCard from '../components/podcast/PodcastCard';
import StayUpdated from '../components/layout/StayUpdated';
import { podcastAPI, Podcast } from '../services/api';
// Removed unused usePodcastStore import
import logoImage from '../assets/logo.jpg';

export default function Home() {
    // Use local state for upcoming podcasts to support pagination/limiting
    const [upcomingPodcasts, setUpcomingPodcasts] = useState<Podcast[]>([]);
    const [upcomingTotal, setUpcomingTotal] = useState(0);
    const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);

    // Use local state for past podcasts (like Podcasts.tsx does)
    const [pastPodcasts, setPastPodcastsLocal] = useState<Podcast[]>([]);
    const [isPastLoading, setIsPastLoading] = useState(false);

    // Combined loading state
    const isLoading = isUpcomingLoading || isPastLoading;

    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Pagination for upcoming podcasts (show all by default)
    const [displayedUpcomingCount, setDisplayedUpcomingCount] = useState(999); // Show all
    const [isLoadingMoreUpcoming, setIsLoadingMoreUpcoming] = useState(false);
    const upcomingObserverRef = useRef<IntersectionObserver | null>(null);
    const upcomingLoadMoreRef = useRef<HTMLDivElement | null>(null);

    // Pagination for past podcasts only
    const [displayedPastCount, setDisplayedPastCount] = useState(2);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const INITIAL_LOAD = 2;
    const BATCH_SIZE = 6;

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | The World's Premier Research-Focused Podcast Series";
    }, []);

    const handleRetry = () => {
        setError(null);
        setRetryCount(prev => prev + 1);
        setDisplayedPastCount(2);
    };

    // Fetch upcoming podcasts - show all upcoming episodes
    useEffect(() => {
        const fetchUpcoming = async () => {
            setIsUpcomingLoading(true);
            try {
                // Fetch all upcoming podcasts with compact mode for performance
                // Compact mode excludes Base64 images, YouTube thumbnails will be used
                const response = await podcastAPI.getAll({
                    category: 'upcoming',
                    compact: true  // Exclude large Base64 images, use YouTube fallback
                });
                setUpcomingPodcasts(response.data.podcasts || []);
                setUpcomingTotal(response.data.pagination?.total || 0);
            } catch (err) {
                console.error('[Home] Error fetching upcoming podcasts:', err);
                // Don't set main error here to allow rest of page to load
            } finally {
                setIsUpcomingLoading(false);
            }
        };

        fetchUpcoming();
    }, [retryCount]);

    // Load more upcoming podcasts (for infinite scroll)
    const loadMoreUpcoming = useCallback(() => {
        if (isLoadingMoreUpcoming || displayedUpcomingCount >= upcomingPodcasts.length) return;

        setIsLoadingMoreUpcoming(true);
        setTimeout(() => {
            setDisplayedUpcomingCount(prev => Math.min(prev + 6, upcomingPodcasts.length));
            setIsLoadingMoreUpcoming(false);
        }, 300);
    }, [displayedUpcomingCount, upcomingPodcasts.length, isLoadingMoreUpcoming]);

    // Setup intersection observer for upcoming podcasts infinite scroll
    useEffect(() => {
        if (upcomingObserverRef.current) upcomingObserverRef.current.disconnect();

        upcomingObserverRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isUpcomingLoading && !isLoadingMoreUpcoming) {
                    loadMoreUpcoming();
                }
            },
            { threshold: 0.1 }
        );

        if (upcomingLoadMoreRef.current) {
            upcomingObserverRef.current.observe(upcomingLoadMoreRef.current);
        }

        return () => {
            if (upcomingObserverRef.current) upcomingObserverRef.current.disconnect();
        };
    }, [loadMoreUpcoming, isUpcomingLoading, isLoadingMoreUpcoming]);

    // Fetch past podcasts DIRECTLY (like Podcasts.tsx)
    useEffect(() => {
        const fetchPast = async () => {
            setIsPastLoading(true);
            setError(null);

            console.log('[Home] Fetching PAST podcasts directly from API...');

            try {
                // PERFORMANCE OPTIMIZATION: Use compact mode + limit initial load
                // This reduces payload from ~2MB to ~50KB for faster page load
                const response = await podcastAPI.getAll({
                    category: 'past',
                    limit: 4,  // Only load 4 initially for speed
                    page: 1,
                    compact: true  // Exclude Base64 images, use YouTube thumbnails
                });

                const podcasts = response.data.podcasts || [];
                console.log('[Home] Received past podcasts:', podcasts.length);

                setPastPodcastsLocal(podcasts);
                setError(null);

                // Show first 2 immediately
                setDisplayedPastCount(INITIAL_LOAD);
            } catch (err) {
                console.error('[Home] Error fetching past podcasts:', err);
                setError('Failed to load podcasts. Please try again later.');
            } finally {
                setIsPastLoading(false);
            }
        };

        fetchPast();
    }, [retryCount]);

    // Infinite scroll for past podcasts
    const loadMorePodcasts = useCallback(() => {
        if (isLoadingMore || displayedPastCount >= pastPodcasts.length) return;

        setIsLoadingMore(true);
        setTimeout(() => {
            setDisplayedPastCount(prev => Math.min(prev + BATCH_SIZE, pastPodcasts.length));
            setIsLoadingMore(false);
        }, 300);
    }, [displayedPastCount, pastPodcasts.length, isLoadingMore]);

    // Setup intersection observer for infinite scroll
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && !isLoadingMore) {
                    loadMorePodcasts();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [loadMorePodcasts, isLoading, isLoadingMore]);

    // Display paginated upcoming and past podcasts
    const displayedUpcoming = upcomingPodcasts.slice(0, displayedUpcomingCount);
    const displayedPast = pastPodcasts.slice(0, displayedPastCount);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Pure white background */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Larger Logo - no "Business Talk" text */}
                        <div className="flex justify-center mb-6">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="w-40 h-40 object-contain rounded-full shadow-lg"
                            />
                        </div>

                        {/* Banner Image */}
                        <div className="flex justify-center mb-8">
                            <img
                                src="/banner.png"
                                alt="Business Talk Banner"
                                className="w-full max-w-4xl object-contain rounded-lg shadow-md"
                                fetchPriority="high"
                                decoding="async"
                            />
                        </div>

                        {/* Welcome text - dark black headers */}
                        <p className="text-base text-gray-800 max-w-4xl mx-auto mb-6 text-justify" style={{ lineHeight: '1.75rem' }}>
                            Welcome to Business Talk, your premier podcast for cutting-edge trends,
                            groundbreaking research, valuable insights from notable books, and engaging
                            discussions from the realms of business and academia. Whether you're an academic scholar, researcher,
                            business professional, or entrepreneur, our episodes will inspire you to question the status quo and
                            spark actionable ideas. Our goal is to deliver valuable research insights from the world's renowned scholars,
                            sharing their unique perspectives and expertise.
                        </p>

                        <p className="text-base text-gray-800 max-w-4xl mx-auto mb-6 text-justify" style={{ lineHeight: '1.75rem' }}>
                            <strong className="text-gray-900">How do we select our speakers?:</strong> The Business Talk committee identifies speakers after a meticulous screening process. These
                            experts are then invited. That is, participation as a speaker is by invitation only. We remain committed to delivering free, high-quality content to our research community and are dedicated to maintaining this model in the future.
                        </p>

                        <p className="text-base text-gray-800 max-w-4xl mx-auto text-justify" style={{ lineHeight: '1.75rem' }}>
                            Brought to you by <a href="https://www.globalmanagementconsultancy.com/" target="_blank" rel="noopener noreferrer" className="text-maroon-700 hover:underline font-medium">Global Management Consultancy</a>,
                            we are committed to driving innovation and excellence in the business community. The podcast recordings are available in both video and audio formats on this webpage.
                            Simply check the footer for links to all our podcast platforms!
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Upcoming Podcasts Section - High-res images only */}
            <section className="py-8 sm:py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                Upcoming Podcast Episodes
                            </h2>
                            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 text-green-700 font-semibold rounded-full text-xs sm:text-sm whitespace-nowrap">
                                {upcomingTotal} Scheduled
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="px-6 py-3 bg-maroon-700 text-white font-semibold rounded-lg hover:bg-maroon-800 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : upcomingPodcasts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No upcoming podcasts scheduled. Check back soon!</p>
                            </div>
                        ) : (
                            <>
                                {/* Display 2 cards per row */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {displayedUpcoming.map((podcast: Podcast) => (
                                        <PodcastCard key={podcast._id} podcast={podcast} variant="thumbnail-only" />
                                    ))}
                                </div>

                                {/* Infinite scroll sentinel for upcoming podcasts */}
                                {displayedUpcomingCount < upcomingPodcasts.length && (
                                    <div
                                        ref={upcomingLoadMoreRef}
                                        className="flex justify-center py-8"
                                    >
                                        {isLoadingMoreUpcoming && (
                                            <div className="flex items-center gap-2 text-maroon-700">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-700"></div>
                                                <span>Loading more episodes...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Previous Podcasts Section - Different background with shadow */}
            <section className="py-16 bg-gray-100 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                Previous Episodes
                            </h2>
                            {pastPodcasts.length > 0 && (
                                <Link
                                    to="/podcasts"
                                    className="flex items-center space-x-2 text-maroon-700 hover:text-maroon-800 font-semibold transition-colors group whitespace-nowrap text-sm sm:text-base"
                                >
                                    <span>View&nbsp;All</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </Link>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-lg h-96 animate-pulse"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="px-6 py-3 bg-maroon-700 text-white font-semibold rounded-lg hover:bg-maroon-800 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : displayedPast.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No previous podcasts available yet.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {displayedPast.map((podcast: Podcast) => (
                                        <PodcastCard key={podcast._id} podcast={podcast} variant="grid" />
                                    ))}
                                </div>

                                {/* Infinite scroll trigger */}
                                {displayedPastCount < pastPodcasts.length && (
                                    <div ref={loadMoreRef} className="flex justify-center mt-8">
                                        {isLoadingMore && (
                                            <div className="flex items-center gap-2 text-maroon-700">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-700"></div>
                                                <span>Loading more podcasts...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Stay Updated Section */}
            {/* Stay Updated Section */}
            <StayUpdated />
        </div>
    );
}
