// Image assets for platform logos
import youtubeLogo from '../../assets/platforms/youtube.png';
import spotifyLogo from '../../assets/platforms/spotify.png';
import appleLogo from '../../assets/platforms/apple-podcasts.png';
import amazonLogo from '../../assets/platforms/amazon-music.png';
import audibleLogo from '../../assets/platforms/audible.jpg';
import soundcloudLogo from '../../assets/platforms/soundcloud.png';

// Map platform to image
const PLATFORM_IMAGES = {
    youtube: youtubeLogo,
    spotify: spotifyLogo,
    apple: appleLogo,
    amazon: amazonLogo,
    audible: audibleLogo,
    soundcloud: soundcloudLogo,
};

interface PlatformButtonProps {
    platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud';
    url: string;
    label: string;
    className?: string;
}

export const PlatformButton = ({ platform, url, label, className = "" }: PlatformButtonProps) => {
    // Keep the background colors for consistent button style, but might need to adjust if logos have backgrounds
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700' },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700' },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700' },
    };

    const config = platformConfig[platform];
    const imageSrc = PLATFORM_IMAGES[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 ${config.bg} text-white rounded-md ${config.hover} transition-colors shadow-md hover:shadow-lg ${className}`}
        >
            <div className="bg-white rounded p-1 flex items-center justify-center">
                <img
                    src={imageSrc}
                    alt={`${label} logo`}
                    className="w-5 h-5 object-contain"
                />
            </div>
            <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
        </a>
    );
};

// Small icon version for footer and cards
export const PlatformIcon = ({ platform, url, size = "md" }: { platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud', url: string, size?: 'sm' | 'md' | 'lg' }) => {
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700' },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700' },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700' },
    };

    const sizeConfig = {
        sm: { circle: 'w-8 h-8', icon: 'w-5 h-5', padding: 'p-1' },
        md: { circle: 'w-12 h-12', icon: 'w-7 h-7', padding: 'p-1.5' },
        lg: { circle: 'w-16 h-16', icon: 'w-10 h-10', padding: 'p-2' },
    };

    const config = platformConfig[platform];
    const sizes = sizeConfig[size];
    const imageSrc = PLATFORM_IMAGES[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizes.circle} rounded-full ${config.bg} ${config.hover} flex items-center justify-center transition-colors shadow-lg flex-shrink-0`}
        >
            <div className={`bg-white rounded-full ${sizes.padding} flex items-center justify-center`}>
                <img
                    src={imageSrc}
                    alt={`${platform} logo`}
                    className={`${sizes.icon} object-contain`}
                />
            </div>
        </a>
    );
};

