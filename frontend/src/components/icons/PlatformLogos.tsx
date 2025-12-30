// Original SVG logos for podcast platforms

interface LogoProps {
    className?: string;
}

export const YouTubeLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

export const SpotifyLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.44 1.56.42.24.599.84.301 1.261zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
);

export const ApplePodcastsLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 5.455c-1.8 0-3.273 1.472-3.273 3.272S10.2 12 12 12s3.273-1.473 3.273-3.273S13.8 5.455 12 5.455zm0 7.636c-.9 0-1.636.737-1.636 1.637v3.817c0 .9.736 1.637 1.636 1.637s1.636-.737 1.636-1.637v-3.817c0-.9-.736-1.637-1.636-1.637z" />
    </svg>
);

export const AmazonMusicLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l7 4.5-7 4.5z" />
    </svg>
);

export const AudibleLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.232 16.8c-.48.384-1.152.288-1.536-.192-.24-.24-.384-.576-.384-.912 0-.24.048-.48.192-.672.72-.96 1.104-2.112 1.104-3.36 0-2.976-2.352-5.376-5.28-5.472h-.528c-2.928.096-5.28 2.496-5.28 5.472 0 1.248.384 2.4 1.104 3.36.144.192.192.432.192.672 0 .336-.144.672-.384.912-.384.48-1.056.576-1.536.192C3.72 15.072 2.976 13.344 2.976 11.52c0-4.992 4.032-9.024 9.024-9.024s9.024 4.032 9.024 9.024c0 1.824-.744 3.552-1.792 5.28z" />
    </svg>
);

export const SoundCloudLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 18V11h2v7H1zm3-4v4h2v-4H4zm3-2v6h2v-6H7zm3-2v8h2V10h-2zm3-1v9h8c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.34 0-.67.04-1 .11C19.07 8.17 16.76 6 14 6c-.88 0-1.71.22-2.44.61-.24.13-.39.39-.39.67v1.72c-.54-.31-1.16-.5-1.83-.5-2.21 0-4 1.79-4 4 0 .38.06.75.16 1.1-.6.44-1 1.14-1 1.93V18h2V14h11z" />
    </svg>
);

// Platform button component with proper logos
interface PlatformButtonProps {
    platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud';
    url: string;
    label: string;
    className?: string;
}

export const PlatformButton = ({ platform, url, label, className = "" }: PlatformButtonProps) => {
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700', Logo: YouTubeLogo },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600', Logo: SpotifyLogo },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', Logo: ApplePodcastsLogo },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', Logo: AmazonMusicLogo },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', Logo: AudibleLogo },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', Logo: SoundCloudLogo },
    };

    const config = platformConfig[platform];
    const { Logo } = config;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-4 py-2.5 ${config.bg} text-white rounded-lg ${config.hover} transition-all duration-200 shadow-md hover:shadow-lg ${className}`}
        >
            <Logo className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
        </a>
    );
};

// Small icon version for footer and cards
export const PlatformIcon = ({ platform, url, size = "md" }: { platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud', url: string, size?: 'sm' | 'md' | 'lg' }) => {
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700', Logo: YouTubeLogo },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600', Logo: SpotifyLogo },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', Logo: ApplePodcastsLogo },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', Logo: AmazonMusicLogo },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', Logo: AudibleLogo },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', Logo: SoundCloudLogo },
    };

    const sizeConfig = {
        sm: { circle: 'w-6 h-6', icon: 'w-3 h-3' },
        md: { circle: 'w-12 h-12', icon: 'w-7 h-7' },
        lg: { circle: 'w-16 h-16', icon: 'w-9 h-9' },
    };

    const config = platformConfig[platform];
    const sizes = sizeConfig[size];
    const { Logo } = config;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizes.circle} rounded-full ${config.bg} ${config.hover} flex items-center justify-center transition-colors shadow-lg flex-shrink-0`}
        >
            <Logo className={`${sizes.icon} text-white`} />
        </a>
    );
};

