import { Request, Response } from 'express';

// Get deployments for a service (uses backend credentials)
export const getDeployments = async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.body;
        // API key always comes from env for security
        const apiKey = process.env.RENDER_API_KEY;

        if (!apiKey) {
            console.error('RENDER_API_KEY is missing in backend environment');
            return res.status(500).json({ message: 'Server configuration error: Missing Render API Key' });
        }

        if (!serviceId) {
            return res.status(400).json({ message: 'Service ID is required' });
        }

        const response = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys?limit=20`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Render API Error:', errorData);
            return res.status(response.status).json({
                message: `Render API Error: ${response.statusText}`,
                details: errorData
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching Render deployments:', error);
        res.status(500).json({ message: 'Failed to fetch deployments', error: error.message });
    }
};

// Get Render configuration (Service IDs only, NO API KEY)
export const getConfig = async (_req: Request, res: Response) => {
    try {
        res.json({
            frontendServiceId: process.env.RENDER_FRONTEND_SERVICE_ID || '',
            backendServiceId: process.env.RENDER_BACKEND_SERVICE_ID || '',
            // Never return the API key here!
        });
    } catch (error: any) {
        console.error('Error fetching Render config:', error);
        res.status(500).json({ message: 'Failed to fetch configuration' });
    }
};
