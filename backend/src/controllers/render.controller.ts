import { Request, Response } from 'express';

export const getDeployments = async (req: Request, res: Response) => {
    try {
        const { serviceId, apiKey } = req.body;

        if (!serviceId || !apiKey) {
            return res.status(400).json({ message: 'Service ID and API Key are required' });
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
