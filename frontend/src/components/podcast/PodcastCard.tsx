import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Youtube, User } from 'lucide-react';
import { Podcast } from '../../services/api';
import { getImageUrl, extractYoutubeId, getYoutubeThumbnail } from '../../utils/imageUrl';
import logoImage from '../../assets/logo.jpg';

interface PodcastCardProps {
    podcast: Podcast;
    variant?: 'featured' | 'grid';
}

export default function PodcastCard({ podcast, variant = 'grid' }: PodcastCardProps) {
    const formattedDate = new Date(podcast.scheduledDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).toUpperCase();

    const youtubeId = extractYoutubeId(podcast.youtubeUrl);

    // Get thumbnail URL - simplified: use any available image
    const getThumbnailUrl = () => {
        // Priority: thumbnailImage > guestImage > YouTube thumbnail
        const thumbnailUrl = getImageUrl(podcast.thumbnailImage);
        if (thumbnailUrl) return thumbnailUrl;

        const guestUrl = getImageUrl(podcast.guestImage);
        if (guestUrl) return guestUrl;

        if (youtubeId) {
            return getYoutubeThumbnail(youtubeId);
        }
        // Return logo as final fallback
        return logoImage;
    };

    // Get guest avatar - for small circular image
    const getGuestAvatar = () => {
        return getImageUrl(podcast.guestImage);
    };

    const thumbnailUrl = getThumbnailUrl();
    const guestAvatar = getGuestAvatar();

    // State for image error handling (moved to top level to comply with Rules of Hooks)
    const [imageError, setImageError] = React.useState(false);

    // Handle image error - try YouTube thumbnail, then logo
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        // Try YouTube thumbnail first
        if (youtubeId && !target.src.includes('youtube.com')) {
            target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
        } else if (!target.src.includes(logoImage)) {
            // Use logo as final fallback
            target.src = logoImage;
        }
    };

    // Featured variant - compact horizontal card for upcoming episodes
    if (variant === 'featured') {
        const showPlaceholder = !thumbnailUrl || imageError;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
                <div className="flex flex-col md:flex-row h-full">
                    {/* Thumbnail */}
                    <div className="w-full md:w-80 flex-shrink-0 relative aspect-video bg-gray-100 overflow-hidden">
                        {showPlaceholder ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-maroon-50 via-maroon-100 to-maroon-200 p-6">
                                <div className="relative mb-3">
                                    <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <svg className="w-10 h-10 text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="22" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-maroon-700 mb-1">Business Talk Podcast</p>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={thumbnailUrl}
                                alt={podcast.guestName}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                        <div className="flex flex-col h-full justify-between">
                            {/* Top: Category & Title */}
                            <div className="mb-4">
                                <span className="text-xs font-semibold text-maroon-600 uppercase tracking-wide">
                                    Upcoming Episode
                                </span>
                                <h3 className="text-base font-bold text-gray-900 mt-2 line-clamp-2 hover:text-maroon-700 transition-colors leading-snug">
                                    {podcast.title}
                                </h3>
                            </div>

                            {/* Middle: Guest Info */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 ring-2 ring-maroon-200 shadow-md">
                                    {guestAvatar ? (
                                        <img
                                            src={guestAvatar}
                                            alt={podcast.guestName}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
                                            <User className="w-7 h-7 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold text-gray-900 truncate">{podcast.guestName}</div>
                                    <div className="text-xs text-gray-600 truncate mt-0.5">{podcast.guestTitle}</div>
                                    {podcast.guestInstitution && (
                                        <div className="text-xs text-gray-500 truncate mt-0.5">{podcast.guestInstitution}</div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom: Date, Time & Platform Icons */}
                            <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-200">
                                <div className="flex flex-col space-y-1.5">
                                    <span className="flex items-center font-semibold text-gray-700">
                                        <Calendar className="w-4 h-4 mr-1.5 text-maroon-600" />
                                        {formattedDate}
                                    </span>
                                    <span className="flex items-center font-semibold text-gray-700">
                                        <Clock className="w-4 h-4 mr-1.5 text-maroon-600" />
                                        {podcast.scheduledTime}
                                    </span>
                                </div>
                                {/* Platform icons */}
                                <div className="flex flex-col space-y-1.5">
                                    {podcast.youtubeUrl && (
                                        <a href={podcast.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 transition-colors shadow-sm">
                                            <Youtube className="w-4 h-4 text-white" />
                                            <span className="text-white text-xs font-semibold">YouTube</span>
                                        </a>
                                    )}
                                    {podcast.spotifyUrl && (
                                        <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-green-500 hover:bg-green-600 transition-colors shadow-sm">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C18.24 9.541 10.68 9.241 6.241 10.561c-.6.15-1.201-.181-1.381-.721-.18-.601.18-1.2.72-1.381 5.16-1.44 13.44-1.02 18.72 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                            </svg>
                                            <span className="text-white text-xs font-semibold">Spotify</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid variant (for past podcasts)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden card-hover group relative"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {thumbnailUrl ? (
                    <>
                        <img
                            src={thumbnailUrl}
                            alt={podcast.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={handleImageError}
                        />
                        {podcast.youtubeUrl && (
                            <a
                                href={podcast.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </a>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-100 to-maroon-200">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-maroon-300 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="22" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-maroon-600">Coming Soon</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
