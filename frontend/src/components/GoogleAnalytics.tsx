
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { settingsAPI } from '../services/api';

export default function GoogleAnalytics() {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const initGA = async () => {
            try {
                // Fetch settings from your backend
                const response = await settingsAPI.get();
                const gaId = response.data.googleAnalyticsId;

                if (gaId && !initialized) {
                    ReactGA.initialize(gaId);
                    setInitialized(true);
                    console.log('Google Analytics Initialized with ID:', gaId);
                }
            } catch (error) {
                console.error('Failed to initialize Google Analytics:', error);
            }
        };

        if (!initialized) {
            initGA();
        }
    }, [initialized]);

    useEffect(() => {
        if (initialized) {
            // Track page view on route change
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [initialized, location]);

    return null; // This component doesn't render anything
}
